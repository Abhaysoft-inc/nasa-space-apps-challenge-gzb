import google.generativeai as genai
from .config import GEMINI_MODEL_NAME, GOOGLE_API_KEY
from .retrieval import retrieve_multimodal

genai.configure(api_key=GOOGLE_API_KEY)
gem = genai.GenerativeModel(GEMINI_MODEL_NAME)

def answer_from_query(query: str, top_k_text=None, top_k_img=None):
    matches = retrieve_multimodal(query, top_k_text, top_k_img)
    
    # Build context string
    context_list = []
    for m in matches:
        meta = m["metadata"]
        if m["source"] == "text":
            text = meta.get("text", "")
            pid = meta.get("paper_id", "")
            pg = meta.get("page", "")
            ci = meta.get("chunk_index", "")
            context_list.append(f"Source: {pid}, page {pg}, chunk {ci}\n{text}")
        elif m["source"] == "image":
            url = meta.get("image_url", "")
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
