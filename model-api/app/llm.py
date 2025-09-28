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

def generate_paper_summary(paper_id: str, top_k_text=10, top_k_img=5):
    """Generate a comprehensive summary of a specific paper using its content"""
    
    # Search for content related to the specific paper
    query = f"paper_id:{paper_id} summary findings methodology results conclusions"
    matches = retrieve_multimodal(query, top_k_text, top_k_img)
    
    # Filter matches to only include content from the specified paper
    paper_matches = [m for m in matches if m.get("metadata", {}).get("paper_id") == paper_id]
    
    if not paper_matches:
        # If no specific paper matches, try a broader search
        broader_query = f"{paper_id} research study experiment"
        matches = retrieve_multimodal(broader_query, top_k_text, top_k_img)
        paper_matches = matches
    
    # Build context from paper content
    context_list = []
    for m in paper_matches[:15]:  # Limit to top 15 matches for summary
        meta = m["metadata"]
        if m["source"] == "text":
            text = meta.get("text", "")
            pid = meta.get("paper_id", "")
            pg = meta.get("page", "")
            ci = meta.get("chunk_index", "")
            context_list.append(f"Source: {pid}, page {pg}, chunk {ci}\n{text}")
        elif m["source"] == "image":
            url = meta.get("image_url", "")
            desc = meta.get("description", "")
            if url or desc:
                context_list.append(f"[Image Reference: {url} - {desc}]")
    
    context = "\n\n".join(context_list) if context_list else "No content found for this paper."
    
    prompt = f"""
You are a research assistant tasked with creating a comprehensive summary of a scientific paper. 
Based on the provided content, create a structured summary that includes:

1. **Main Research Question/Objective**
2. **Methodology/Experimental Design**
3. **Key Findings**
4. **Conclusions and Implications**
5. **Significance and Impact**

Please format your response using markdown with clear headings and bullet points where appropriate.
If the content is insufficient to provide a complete summary, indicate what information is missing.

Paper Content:
{context}

Generate a comprehensive summary:
"""
    
    resp = gem.generate_content(prompt)
    summary_text = resp.text if hasattr(resp, "text") else resp.candidates[0].content.parts[0].text
    
    return {
        "summary": summary_text,
        "sources_used": len(paper_matches),
        "paper_id": paper_id
    }
