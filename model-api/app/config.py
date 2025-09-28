import os

# Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "pcsk_73fzGC_EkqGu38kPmvQGKPDv3pcZ4WQ4oDTAorq5uyEYsxsgWB9GaX34MMMCmGvFQiBWJp")
TEXT_INDEX_NAME = "my-multimodal-rag-text"
IMAGE_INDEX_NAME = "my-multimodal-rag-image"
PINECONE_REGION = "us-east-1"

# LLM
GEMINI_MODEL_NAME = "gemini-2.5-pro"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyC5XlpDGwiPOc-cHX1jKtFsMSVYd3xPGGM")

# Retrieval
TOP_K_TEXT = 5
TOP_K_IMAGE = 3
