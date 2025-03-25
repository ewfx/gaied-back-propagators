import hashlib
import json
from db.mongoDB import collection
from db.redisConnection import redis_client

# Read eml file and convert it to a string
def read_eml_file(file_path: str) -> str:
    try:
        with open(file_path, "rb") as file:
            return file.read()
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Compute SHA-256 Hash for Email
def compute_email_hash(email_content: str) -> str:
    return hashlib.sha256(email_content.encode()).hexdigest()

# Check if an Email is a Duplicate
def check_duplicate_email(email_content: str):
    email_hash = compute_email_hash(email_content)

    # Check Redis First
    cached_data = redis_client.get(email_hash)
    if cached_data:
        return json.loads(cached_data)

    # Check MongoDB
    result = collection.find_one({"email_hash": email_hash})
    if result:
        redis_client.set(email_hash, json.dumps(
            result["extracted_details"]))  # Cache it
        return result["extracted_details"]

    return None  # New email

# Store Email Details in MongoDB and Cache in Redis
def store_email_details(email_content: str, extracted_details: dict):
    email_hash = compute_email_hash(email_content)
    collection.insert_one(
        {"email_hash": email_hash, "extracted_details": extracted_details})
    redis_client.set(email_hash, json.dumps(extracted_details))

