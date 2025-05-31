from langchain_community.embeddings import HuggingFaceEmbeddings
from src.utils.config import EMBEDDING_MODEL_NAME

# Initializing the embedding_model with the specified Hugging Face mode
embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
