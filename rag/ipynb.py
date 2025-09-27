# ======================================================
# 📌 1. Install dependencies
# ======================================================
!pip install PyMuPDF langchain-text-splitters sentence-transformers pinecone google-generativeai tqdm

# ======================================================
# 📌 2. Imports
# ======================================================
import os
import fitz  # PyMuPDF
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai
from tqdm.auto import tqdm
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
import time

# ======================================================
# 📌 3. User Config - API keys and folders
# ======================================================
PDF_FOLDER = "/content/pdfs"            # upload PDFs here

GOOGLE_API_KEY = "AIzaSyBQBigt-xLwws1iNp_i-6gb3XXq8RRVUGA"  # Gemini API key
PINECONE_API_KEY = "pcsk_73fzGC_EkqGu38kPmvQGKPDv3pcZ4WQ4oDTAorq5uyEYsxsgWB9GaX34MMMCmGvFQiBWJp" # Replace with your Pinecone API key
PINECONE_INDEX_NAME = "my-rag-index" # Replace with your desired index name

# ======================================================
# 📌 4. Extract text from PDFs
# ======================================================
texts = []
pdf_files = list(Path(PDF_FOLDER).glob("*.pdf"))

if not pdf_files:
    print(f"No PDF files found in {PDF_FOLDER}. Please upload your PDFs to this folder.")
else:
    processed_files_count = 0
    for pdf_path in pdf_files:
        try:
            doc = fitz.open(pdf_path)
            processed_files_count += 1
            for page_num, page in enumerate(doc):
                text = page.get_text("text")
                texts.append({
                    "paper_id": pdf_path.stem,
                    "page": page_num + 1,
                    "text": text
                })
            print(f"Successfully extracted text from {pdf_path.name}")
        except Exception as e:
            print(f"Error extracting text from {pdf_path.name}: {e}")

    print(f"Processed {processed_files_count} out of {len(pdf_files)} files.")
    print(f"Extracted {len(texts)} pages in total.")

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
                    "page": record["page"],
                    "text": chunk # Store text in metadata for retrieval
                }
            })

    print(f"Total chunks created: {len(chunks)}")


    # Load a pre-trained model for embeddings
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    # Get embedding dimension
    if chunks:
        dimension = len(embedding_model.encode(chunks[0]["text"]))
    else:
        dimension = 384 # Default dimension for 'all-MiniLM-L6-v2'


    # ======================================================
    # 📌 6. Initialize Pinecone and Create Index
    # ======================================================
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index exists, if not create it
    if PINECONE_INDEX_NAME not in pc.list_indexes():
        print(f"Creating index '{PINECONE_INDEX_NAME}'...")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=dimension,
            metric="cosine", # or "euclidean", "dotproduct"
            spec=ServerlessSpec(cloud='aws', region='us-east-1') # Choose appropriate cloud and region
        )
        # wait for index to be initialized
        while not pc.describe_index(PINECONE_INDEX_NAME).status['ready']:
            time.sleep(1)
        print("✅ Index created.")
    else:
        print(f"Index '{PINECONE_INDEX_NAME}' already exists.")

    index = pc.Index(PINECONE_INDEX_NAME)
    print(f"Index stats: {index.describe_index_stats()}")


    # ======================================================
    # 📌 7. Generate Embeddings and Upload to Pinecone
    # ======================================================
    batch_size = 100 # Adjust batch size as needed
    # Ensure there are chunks to process before generating embeddings
    if chunks:
        for i in tqdm(range(0, len(chunks), batch_size)):
            batch = chunks[i:i + batch_size]
            # Prepare data for upserting
            vectors_to_upsert = []
            for chunk in batch:
                embedding = embedding_model.encode(chunk["text"]).tolist() # Convert to list for Pinecone
                vectors_to_upsert.append({
                    "id": chunk["id"],
                    "values": embedding,
                    "metadata": chunk["metadata"]
                })
            # Upsert to Pinecone
            index.upsert(vectors=vectors_to_upsert)

        print("✅ Finished generating embeddings and uploading to Pinecone")
    else:
        print("No chunks to generate embeddings for.")


    # ======================================================
    # 📌 8. Initialize Google Gemini client
    # ======================================================
    genai.configure(api_key=GOOGLE_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro-latest') # Using gemini-pro-latest


    # ======================================================
    # 📌 9. Retrieval function (using Pinecone)
    # ======================================================
    def retrieve_chunks(query, k=5):
        # Generate embedding for the query
        q_emb = embedding_model.encode(query).tolist()
        # Query Pinecone index
        results = index.query(vector=q_emb, top_k=k, include_metadata=True)
        # Extract the text from the results
        retrieved_texts = [match['metadata']['text'] for match in results['matches']]
        return retrieved_texts


    # ======================================================
    # 📌 10. Generate answer with Gemini
    # ======================================================
    def generate_answer(query, k=5):
        top_chunks_text = retrieve_chunks(query, k)
        context = "\n\n".join(top_chunks_text)

        prompt = f"""
        You are an expert research assistant. Use only the context below to answer the question.

        Context:
        {context}

        Question: {query}
        """

        response = gemini_model.generate_content(prompt)
        return response.text

    # ======================================================
    # 📌 11. Test it!
    # ======================================================
    query = "tell me about the Stem Cell Health and Tissue Regeneration in Microgravity"
    # Ensure there are chunks before attempting to generate an answer
    if chunks:
        answer = generate_answer(query)
        print("\n💡 Answer from Gemini:\n")
        print(answer)
    else:
        print("\nNo text extracted from PDFs to generate an answer.")