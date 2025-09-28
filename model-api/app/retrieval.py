from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

from concurrent.futures import ThreadPoolExecutor
from .config import *

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index_text = pc.Index(TEXT_INDEX_NAME)
index_image = pc.Index(IMAGE_INDEX_NAME)

# Load embedding models
text_model = SentenceTransformer("all-MiniLM-L6-v2")   # 384-dim
image_model = SentenceTransformer("clip-ViT-B-32")    # 512-dim

def query_text_index(query, top_k=None):
    if top_k is None:
        top_k = TOP_K_TEXT
    vec = text_model.encode(query).tolist()
    res = index_text.query(vector=vec, top_k=top_k, include_metadata=True)
    results = [{"id": m["id"], "score": m["score"], "metadata": m["metadata"], "source": "text"} 
               for m in res.get("matches", [])]
    return results

def query_image_index(query, top_k=None):
    if top_k is None:
        top_k = TOP_K_IMAGE
    vec = image_model.encode([query])[0].tolist()
    res = index_image.query(vector=vec, top_k=top_k, include_metadata=True)
    results = [{"id": m["id"], "score": m["score"], "metadata": m["metadata"], "source": "image"} 
               for m in res.get("matches", [])]
    return results

def retrieve_multimodal(query, top_k_text=None, top_k_img=None):
    if top_k_text is None:
        top_k_text = TOP_K_TEXT
    if top_k_img is None:
        top_k_img = TOP_K_IMAGE
    
    # Parallel retrieval
    with ThreadPoolExecutor(max_workers=2) as executor:
        text_future = executor.submit(query_text_index, query, top_k_text)
        image_future = executor.submit(query_image_index, query, top_k_img)
        results_text = text_future.result()
        results_image = image_future.result()
    
    results = results_text + results_image
    # Sort descending by score
    results = [r for r in results if r["score"] is not None]
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
