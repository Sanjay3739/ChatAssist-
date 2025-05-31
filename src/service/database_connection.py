from pymongo import MongoClient
from src.utils.config import ATLAS_CONNECTION_STRING, DB_NAME, COLLECTION_NAME

# Establish a connection to the MongoDB cluster using the connection string
cluster = MongoClient(ATLAS_CONNECTION_STRING)

# Access the specified database and collection from the MongoDB cluster
MONGODB_COLLECTION = cluster[DB_NAME][COLLECTION_NAME]