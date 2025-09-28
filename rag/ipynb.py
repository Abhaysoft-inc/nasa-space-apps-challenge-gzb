#  error with gemini

# =========================
# 1. Install dependencies (ensure correct versions)
# =========================
!pip install --upgrade PyMuPDF langchain langchain_experimental langchain-text-splitters sentence-transformers pinecone-client google-generativeai tqdm pillow

# =========================
# 2. Imports
# =========================
import os
import io
import time
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image
from tqdm.auto import tqdm

from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Import SemanticChunker from experimental
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings


from pinecone import Pinecone, ServerlessSpec

# =========================
# 3. Configuration
# =========================
PDF_FOLDER = "/content/pdfs"

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyC5XlpDGwiPOc-cHX1jKtFsMSVYd3xPGGM")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "pcsk_73fzGC_EkqGu38kPmvQGKPDv3pcZ4WQ4oDTAorq5uyEYsxsgWB9GaX34MMMCmGvFQiBWJp")
INDEX_BASE = "my-multimodal-rag"
INDEX_TEXT = INDEX_BASE + "-text"
INDEX_IMAGE = INDEX_BASE + "-image"

PINECONE_REGION = "us-east-1"
GEMINI_MODEL_NAME = "gemini-pro"

genai.configure(api_key=GOOGLE_API_KEY)

# =========================
# 4. Load embedding models & chunker
# =========================
# text_model = SentenceTransformer("all-MiniLM-L6-v2")
clip_model = SentenceTransformer("clip-ViT-B-32")

# Wrap your text model with HuggingFaceEmbeddings
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Use semantic chunker with the wrapped embedding model
semantic_chunker = SemanticChunker(embedding_model)

# =========================
# 5. PDF extraction of text + images
# =========================
def extract_from_pdf(pdf_path: Path):
    texts = []
    images = []
    doc = fitz.open(pdf_path)
    pid = pdf_path.stem
    for page_num, page in enumerate(doc, start=1):
        txt = page.get_text("text")
        if txt and txt.strip():
            texts.append({"paper_id": pid, "page": page_num, "text": txt})
        for img_idx, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            try:
                base = doc.extract_image(xref)
                img_bytes = base["image"]
                ext = base.get("ext", "png")
                pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                images.append({
                    "paper_id": pid,
                    "page": page_num,
                    "image_index": img_idx,
                    "pil_image": pil,
                    "ext": ext
                })
            except Exception as e:
                print("Image extraction failed:", pdf_path, page_num, img_idx, e)
    doc.close()
    return texts, images

# =========================
# 6. Load all PDFs
# =========================
pdfs = list(Path(PDF_FOLDER).glob("*.pdf"))
if not pdfs:
    raise RuntimeError(f"No PDF files in {PDF_FOLDER}")

all_texts = []
all_images = []
for p in tqdm(pdfs, desc="Extracting PDFs"):
    t, im = extract_from_pdf(p)
    all_texts.extend(t)
    all_images.extend(im)

print("Text pages:", len(all_texts), "Images:", len(all_images))

# =========================
# 7. Semantic chunking of texts
# =========================
text_chunks = []
for rec in all_texts:
    # semantic_chunker.split_text() returns list of string chunks
    for i, c in enumerate(semantic_chunker.split_text(rec["text"])):
        cid = f"{rec['paper_id']}_p{rec['page']}_c{i}"
        text_chunks.append({
            "id": cid,
            "text": c,
            "metadata": {
                "paper_id": rec["paper_id"],
                "page": rec["page"],
                "chunk_index": i,
                "type": "text"
            }
        })

print("Total semantic text chunks:", len(text_chunks))

# =========================
# 8. Prepare image items
# =========================
image_items = []
for itm in all_images:
    iid = f"{itm['paper_id']}_p{itm['page']}_img{itm['image_index']}"
    image_items.append({
        "id": iid,
        "pil_image": itm["pil_image"],
        "metadata": {
            "paper_id": itm["paper_id"],
            "page": itm["page"],
            "image_index": itm["image_index"],
            "type": "image"
        }
    })

print("Total images:", len(image_items))

# =========================
# 9. Initialize Pinecone indexes
# =========================
pc = Pinecone(api_key=PINECONE_API_KEY)

def ensure_index(name: str, dim: int):
    existing = [i["name"] for i in pc.list_indexes().get("indexes", [])]
    if name not in existing:
        print("Creating index:", name)
        pc.create_index(
            name=name,
            dimension=dim,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region=PINECONE_REGION)
        )
        while not pc.describe_index(name).status["ready"]:
            time.sleep(1)
    else:
        print("Index exists:", name)

dim_text = len(embedding_model.embed_query("test")) # Use embed_query for dimension
dim_img = len(clip_model.encode([Image.new("RGB", (10,10))])[0])

ensure_index(INDEX_TEXT, dim_text)
ensure_index(INDEX_IMAGE, dim_img)

index_text = pc.Index(INDEX_TEXT)
index_image = pc.Index(INDEX_IMAGE)

print("Index stats (text):", index_text.describe_index_stats())
print("Index stats (image):", index_image.describe_index_stats())

# =========================
# 10. Upsert embeddings
# =========================
BATCH = 64

# Text embeddings
for i in tqdm(range(0, len(text_chunks), BATCH), desc="Upserting text"):
    batch = text_chunks[i:i+BATCH]
    texts_to_enc = [c["text"] for c in batch]
    embs = embedding_model.embed_documents(texts_to_enc) # Use embed_documents
    vectors = []
    for j, c in enumerate(batch):
        vectors.append({
            "id": c["id"],
            "values": embs[j],
            "metadata": c["metadata"] | {"text": c["text"]}
        })
    index_text.upsert(vectors=vectors)

# Image embeddings
for i in tqdm(range(0, len(image_items), BATCH), desc="Upserting images"):
    batch = image_items[i:i+BATCH]
    imgs = [itm["pil_image"] for itm in batch]
    embs = clip_model.encode(imgs, show_progress_bar=False)
    vectors = []
    for j, itm in enumerate(batch):
        vectors.append({
            "id": itm["id"],
            "values": embs[j].tolist(),
            "metadata": itm["metadata"]
        })
    index_image.upsert(vectors=vectors)

print("Finished upserts")

# =========================
# 11. Retrieval + answer generation
# =========================
def retrieve_multimodal(query: str, topk_t: int = 5, topk_i: int = 5):
    results = []
    # text side
    q_emb_t = embedding_model.embed_query(query) # Use embed_query
    res_t = index_text.query(vector=q_emb_t, top_k=topk_t, include_metadata=True)
    for m in getattr(res_t, "matches", res_t.get("matches", [])):
        meta = m.metadata if hasattr(m, "metadata") else m.get("metadata")
        sc = m.score if hasattr(m, "score") else m.get("score")
        mid = m.id if hasattr(m, "id") else m.get("id")
        results.append({"id": mid, "score": sc, "metadata": meta, "source": "text"})

    # image (cross-modal) side
    q_emb_i = clip_model.encode([query], show_progress_bar=False)[0].tolist()
    res_i = index_image.query(vector=q_emb_i, top_k=topk_i, include_metadata=True)
    for m in getattr(res_i, "matches", res_i.get("matches", [])):
        meta = m.metadata if hasattr(m, "metadata") else m.get("metadata")
        sc = m.score if hasattr(m, "score") else m.get("score")
        mid = m.id if hasattr(m, "id") else m.get("id")
        results.append({"id": mid, "score": sc, "metadata": meta, "source": "image"})

    # sort by score descending
    results = [r for r in results if r["score"] is not None]
    results.sort(key=lambda x: x["score"], reverse=True)
    return results

gem = genai.GenerativeModel(GEMINI_MODEL_NAME)

def answer_from_query(query: str, topk_text: int = 5, topk_img: int = 3):
    matches = retrieve_multimodal(query, topk_text, topk_img)
    # build context from text matches
    text_ctx = []
    for m in matches:
        if m["source"] == "text":
            txt = m["metadata"].get("text", "")
            pid = m["metadata"].get("paper_id", "")
            pg = m["metadata"].get("page", "")
            ci = m["metadata"].get("chunk_index", "")
            text_ctx.append(f"Source: {pid}, page {pg}, chunk {ci}\n{txt}")
    context = "\n\n".join(text_ctx) if text_ctx else "No context found."

    prompt = f"""
You are a helpful research assistant. Use only the context below to answer the question. If no answer is found, respond “I don’t know.”

Context:
{context}

Question: {query}
"""
    resp = gem.generate_content(prompt)
    if hasattr(resp, "text"):
        return resp.text, matches
    else:
        return resp.candidates[0].content.parts[0].text, matches

# =========================
# 12. Test
# =========================
q = "Stem cell regeneration in microgravity"
ans, mm = answer_from_query(q, topk_text=5, topk_img=3)
print("Answer:\n", ans)
print("\nTop matches:")
for m in mm[:8]:
    print(m["source"], m["id"], m["score"], m["metadata"])