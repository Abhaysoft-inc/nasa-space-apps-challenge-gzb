from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .llm import answer_from_query

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
