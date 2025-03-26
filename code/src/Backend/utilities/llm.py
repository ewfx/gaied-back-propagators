import google.generativeai as genai
import os
from dotenv import load_dotenv
import json


def get_ai_explanation(model_name="gemini-2.0-flash", email="Blank email") -> str:

    load_dotenv()
    api_key = os.getenv("GENAI_API_KEY")

    if not api_key:
        print("Error: GENAI_API_KEY not found in environment variables.")
        return None
    prompt = f"""Analyse the following email (eml format file) and give me the outputs in the following json format

    -   Request code : Request code the emailc an be classified into.
    -   Sub-request Code: [list of strings]. The possible sub request types the email can be classified into  
    -   Sender Address: The sender's address, if provided.
    -   Primary Request: The main request for the email.
    -   Key Values: Any key points mentioned in the email in a json format. Eg: {{"key1": "value1", "key2": "value2"}}
    -   Confidence Score: A number between 0-100 indicating the confidence level of your response.
    
    The below are the request types and sub request types that the email can be classified into:
    Request types (its sub-request-types) : Adjustment (Nil), AU Transfer (Nil), Closing Notice (Reallocation Fees, Amendment Fees, Reallocation Principal), Commitment Change (Cashless Roll, Decrease, Increase), Fee Payment (Ongoing Fee, Letter of Credit Fee), Money Movement-Inbound (Principal, Interest, Principal + Interest, Principal+Interest+Fee), Money Movement - Outbound (Timebound, Foreign Currency)
    
    Email Description:
    {email}

    Response Must be in a json format.
    {{
        "request_type": "",
        "sub_request_type": "",
        "sender_address": "",
        "primary_request": "",
        "key_values": keypoints in json format,
        "confidence_score": 0
    }}
    
    """
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return llmformat(format_llm_resp(response.text))
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def format_llm_resp(st):
    lines = st.strip().split("\n")
    if len(lines) > 2:
        return "\n".join(lines[1:-1]).strip()
    return ""  

def llmformat(st):
    load_dotenv()
    api_key = os.getenv("GENAI_API_KEY")
    prompt = f"""
        This is my broken json format. format it correctly and give me the json only. No additional text/ explaination needed.
        {st}
    """
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return format_llm_resp(response.text)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    with open("email_sample.eml", "r") as f:
        email = f.read()
    interm= get_ai_explanation(email=email)
    print(interm)
    print("------------------------------------------------")
    print(json.loads(interm))
    print("------------------------------------------------")
    print(type(json.loads(llmformat(interm))))