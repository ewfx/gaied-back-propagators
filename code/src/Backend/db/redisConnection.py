import redis
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    redis_client = redis.StrictRedis(
        host=os.getenv("REDIS_HOST"),
        port=int(os.getenv("REDIS_PORT")),
        password=os.getenv("REDIS_PASSWORD"),
        decode_responses=True
    )
    print("✅ Redis Connected Successfully!")
except Exception as e:
    print(f"❌ Redis Connection Failed: {e}")

# Export Redis client for use in other files
__all__ = ["redis_client"]
