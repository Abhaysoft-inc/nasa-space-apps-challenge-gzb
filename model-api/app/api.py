from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .llm import answer_from_query, generate_paper_summary

app = FastAPI(title="Multimodal Research Chatbot")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat_endpoint(data: dict):
    query = data.get("query", "")
    if not query:
        return {"error": "Query cannot be empty."}
    
    answer, matches = answer_from_query(query)
    return {"query": query, "answer": answer, "matches": matches[:5]}

@app.post("/summarize")
async def summarize_paper_endpoint(data: dict):
    paper_id = data.get("paper_id", "")
    top_k_text = data.get("top_k_text", 10)
    top_k_img = data.get("top_k_img", 5)
    
    if not paper_id:
        return {"error": "paper_id is required."}
    
    try:
        result = generate_paper_summary(paper_id, top_k_text, top_k_img)
        return {
            "paper_id": paper_id,
            "summary": result["summary"],
            "sources_used": result["sources_used"],
            "status": "success"
        }
    except Exception as e:
        return {
            "error": f"Failed to generate summary: {str(e)}",
            "paper_id": paper_id,
            "status": "error"
        }
