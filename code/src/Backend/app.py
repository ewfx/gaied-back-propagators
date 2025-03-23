from flask import Flask, request, jsonify
from pymongo import MongoClient
import hashlib
import json
import redis
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI)
    db = client.get_database("gaied")
    collection = db.get_collection("emails")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}")

# Redis Connection
redis_client = redis.StrictRedis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)


def compute_email_hash(email_content: str) -> str:
    return hashlib.sha256(email_content.encode()).hexdigest()


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


def store_email_details(email_content: str, extracted_details: dict):
    email_hash = compute_email_hash(email_content)
    collection.insert_one(
        {"email_hash": email_hash, "extracted_details": extracted_details})
    redis_client.set(email_hash, json.dumps(extracted_details))


def process_email_with_llm(email_text: str) -> dict:
    return {
        "request_type": "Support Request",
        "sub_request_type": ["Password Reset", "Account Recovery"],
        "key_values": {"username": "user123", "email": "user@example.com"}
    }


@app.route("/process_email", methods=["POST"])
def process_email():
    data = request.json
    email_text = data.get("email_text")

    if not email_text:
        return jsonify({"error": "Email content is required"}), 400

    # Check Duplicate
    existing_details = check_duplicate_email(email_text)
    if existing_details:
        return jsonify({"message": "Duplicate email detected", "extracted_details": existing_details})

    # Process Email
    extracted_info = process_email_with_llm(email_text)
    store_email_details(email_text, extracted_info)

    return jsonify({"message": "New email processed", "extracted_details": extracted_info})


if __name__ == "__main__":
    app.run(debug=True)
