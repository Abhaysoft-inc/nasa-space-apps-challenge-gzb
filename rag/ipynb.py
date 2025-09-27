# ======================================================
# 📌 1. Install dependencies
# ======================================================
!pip install nlpcloud faiss-cpu google-generativeai PyMuPDF langchain-text-splitters

# ======================================================
# 📌 2. Imports
# ======================================================
import os
import fitz  # PyMuPDF
import pickle
import numpy as np
import nlpcloud
import faiss
import time # Import time for adding delays
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai
from tqdm.auto import tqdm # Import tqdm for progress bar


# ======================================================
# 📌 3. User Config - API keys and folders
# ======================================================
NLP_API_KEY = "7723821d5cb457a79ca7652db97f9c9c01c052ea"   # NLPCloud key
EMBED_MODEL = "paraphrase-multilingual-mpnet-base-v2"  # embedding model
PDF_FOLDER = "/content/pdfs"            # upload PDFs here

GOOGLE_API_KEY = "AIzaSyBQBigt-xLwws1iNp_i-6gb3XXq8RRVUGA"  # Gemini API key

# ======================================================
# 📌 4. Extract text from PDFs
# ======================================================
texts = []
for pdf_path in Path(PDF_FOLDER).glob("*.pdf"):
    doc = fitz.open(pdf_path)
    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        texts.append({
            "paper_id": pdf_path.stem,
            "page": page_num + 1,
            "text": text
        })

print(f"Extracted {len(texts)} pages from PDFs")

# ======================================================
# 📌 5. Chunk text
# ======================================================
splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
chunks = []
for record in texts:
    for i, chunk in enumerate(splitter.split_text(record["text"])):
        chunks.append({
            "id": f"{record['paper_id']}_{record['page']}_{i}",
            "text": chunk,
            "metadata": {
                "paper_id": record["paper_id"],
                "page": record["page"]
            }
        })

print(f"Total chunks created: {len(chunks)}")



# Install the sentence-transformers library
!pip install sentence-transformers

# Import the library
from sentence_transformers import SentenceTransformer
import numpy as np
from tqdm.auto import tqdm

# Load a pre-trained model (you can choose a different one based on your needs)
# 'all-MiniLM-L6-v2' is a good general-purpose model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# ======================================================
# 📌 6. Generate embeddings via Sentence-Transformers
# ======================================================
# Assuming 'chunks' is already defined from the previous steps

embeddings = []
for chunk in tqdm(chunks):
    # The encode method can handle a list of strings for batch processing
    # but we will process one by one for simplicity and to match the previous structure
    embedding = embedding_model.encode(chunk["text"])
    chunk["embedding"] = embedding

print("✅ Finished generating embeddings using Sentence-Transformers")

# Now you can continue with storing in FAISS and querying as before
# The rest of the code (Steps 7-12) can remain the same,
# just make sure to use the 'chunks' list with the new embeddings.

# ======================================================
# 📌 7. Store in FAISS
# ======================================================
dimension = len(chunks[0]["embedding"])
index = faiss.IndexFlatL2(dimension)
vectors = np.array([c["embedding"] for c in chunks]).astype("float32")
index.add(vectors)

faiss.write_index(index, "papers.index")
with open("metadata.pkl", "wb") as f:
    pickle.dump(chunks, f)

print("✅ Stored FAISS index + metadata")

# ======================================================
# 📌 8. Load FAISS and metadata (for querying)
# ======================================================
index = faiss.read_index("papers.index")
with open("metadata.pkl", "rb") as f:
    chunks = pickle.load(f)

# ======================================================
# 📌 9. Initialize Google Gemini client
# ======================================================
# Assuming GOOGLE_API_KEY is already defined
import google.generativeai as genai
genai.configure(api_key=GOOGLE_API_KEY)

# List available models to find one that supports generateContent
# for m in genai.list_models():
#   if 'generateContent' in m.supported_generation_methods:
#     print(m.name)

gemini_model = genai.GenerativeModel('gemini-pro-latest') # Using gemini-pro-latest


# ======================================================
# 10. Retrieval function
# ======================================================
def retrieve_chunks(query, k=5):
    # Generate embedding for the query using the same model
    q_emb = embedding_model.encode(query)
    D, I = index.search(np.array([q_emb]).astype("float32"), k)
    return [chunks[i] for i in I[0]]

# ======================================================
# 📌 11. Generate answer with Gemini
# ======================================================
def generate_answer(query, k=5):
    top_chunks = retrieve_chunks(query, k)
    context = "\n\n".join([c["text"] for c in top_chunks])

    prompt = f"""
    You are an expert research assistant. Use only the context below to answer the question.

    Context:
    {context}

    Question: {query}
    """

    response = gemini_model.generate_content(prompt)
    return response.text

# ======================================================
# 📌 12. Test it!
# ======================================================
query = "tell me about the Stem Cell Health and Tissue Regeneration in Microgravity	"
answer = generate_answer(query)
print("\n💡 Answer from Gemini:\n")
print(answer)