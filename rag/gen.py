#  this page give retreives the data from vector db


!pip install sentence-transformers pinecone-client google-generativeai

import os
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import pinecone


# -----------------------
# Config
# -----------------------
PINECONE_API_KEY = "pcsk_73fzGC_EkqGu38kPmvQGKPDv3pcZ4WQ4oDTAorq5uyEYsxsgWB9GaX34MMMCmGvFQiBWJp"
TEXT_INDEX_NAME = "my-multimodal-rag-text"   # already created
IMAGE_INDEX_NAME = "my-multimodal-rag-image" # already created
GEMINI_MODEL_NAME = "gemini-pro-latest"
GOOGLE_API_KEY = "AIzaSyC5XlpDGwiPOc-cHX1jKtFsMSVYd3xPGGM"

genai.configure(api_key=GOOGLE_API_KEY)

# -----------------------
# Initialize Pinecone
# -----------------------
pc = Pinecone(api_key=PINECONE_API_KEY)
index_text = pc.Index(TEXT_INDEX_NAME)
index_image = pc.Index(IMAGE_INDEX_NAME)

# -----------------------
# Load models
# -----------------------
text_model = SentenceTransformer("all-MiniLM-L6-v2")   # 384-dim text model
image_model = SentenceTransformer("clip-ViT-B-32")    # 512-dim image model

# -----------------------
# Retrieval function
# -----------------------
def retrieve_multimodal(query: str, topk_text=5, topk_img=5):
    results = []

    # --- Text retrieval ---
    query_vec_text = text_model.encode(query).tolist()
    res_text = index_text.query(vector=query_vec_text, top_k=topk_text, include_metadata=True)
    for match in res_text.get("matches", []):
        results.append({"id": match["id"], "score": match["score"], "metadata": match["metadata"], "source": "text"})

    # --- Image retrieval ---
    query_vec_image = image_model.encode([query])[0].tolist()
    res_image = index_image.query(vector=query_vec_image, top_k=topk_img, include_metadata=True)
    for match in res_image.get("matches", []):
        results.append({"id": match["id"], "score": match["score"], "metadata": match["metadata"], "source": "image"})

    # Sort by score descending
    results = [r for r in results if r["score"] is not None]
    results.sort(key=lambda x: x["score"], reverse=True)
    return results

# -----------------------
# LLM Answer generation
# -----------------------
gem = genai.GenerativeModel(GEMINI_MODEL_NAME)

def answer_from_query(query: str, topk_text=5, topk_img=3):
    matches = retrieve_multimodal(query, topk_text, topk_img)

    context_list = []
    for m in matches:
        if m["source"] == "text":
            txt = m["metadata"].get("text", "")
            pid = m["metadata"].get("paper_id", "")
            pg = m["metadata"].get("page", "")
            ci = m["metadata"].get("chunk_index", "")
            context_list.append(f"Source: {pid}, page {pg}, chunk {ci}\n{txt}")
        elif m["source"] == "image":
            url = m["metadata"].get("image_url", "")
            if url:
                context_list.append(f"[Image Reference: {url}]")

    context = "\n\n".join(context_list) if context_list else "No context found."

    prompt = f"""
You are a helpful research assistant. Use only the context below to answer the question. If no answer is found, respond “I don’t know.”

Context:
{context}

Question: {query}
"""
    resp = gem.generate_content(prompt)
    return resp.text if hasattr(resp, "text") else resp.candidates[0].content.parts[0].text, matches

# -----------------------
# Example usage
# -----------------------
q = "is there any paper on mice?"
answer, matches = answer_from_query(q, topk_text=5, topk_img=3)
print("Answer:\n", answer)
print("\nTop matches:")
for m in matches[:8]:
    print(m["source"], m["id"], m["score"], m["metadata"])
