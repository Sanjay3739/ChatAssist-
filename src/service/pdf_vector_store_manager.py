from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from src.models.embeddings import embedding_model
from src.utils.config import CHUNK_SIZE, CHUNK_OVERLAP, INDEX_NAME
from langchain.docstore.document import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from src.service.database_connection import MONGODB_COLLECTION
from src.utils.config import PDF_FILE_PATH

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_files):
    text = ""
    for pdf in pdf_files:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

# Function to split text into chunks based on specified parameters
def split_text_into_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", " "],
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
    )
    return text_splitter.split_text(text)

# Function to create a vector store from text chunks using an embedding model
def create_vector_store(text_chunks):
    documents = [Document(page_content=chunk) for chunk in text_chunks]
    db = MongoDBAtlasVectorSearch.from_documents(
        documents=documents,
        embedding=embedding_model,
        collection=MONGODB_COLLECTION,
        index_name=INDEX_NAME,
    )
    return db

# Function to retrieve an existing vector store
def get_vector_store():
    db = MongoDBAtlasVectorSearch(
        MONGODB_COLLECTION,
        embedding=embedding_model,
        index_name=INDEX_NAME,
    )
    return db

# Function to get or create a vector store based on the existence of documents in the collection
def get_or_create_vector_store():
    document_count = MONGODB_COLLECTION.count_documents({})
    if document_count > 0:
        return get_vector_store()
    else:
        return create_vector_store(
            split_text_into_chunks(extract_text_from_pdf(PDF_FILE_PATH))
        )

# Get or create vector stores
vectorstore = get_or_create_vector_store()