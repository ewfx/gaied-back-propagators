import google.generativeai as genai
import os
from dotenv import load_dotenv


def get_ai_explanation(model_name="gemini-2.0-flash", email="Explain how AI works"):

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
    
    The below are the request types and sub request types that the email can be classified into:
    Request types (its sub-request-types) : Adjustment (Nil), AU Transfer (Nil), Closing Notice (Reallocation Fees, Amendment Fees, Reallocation Principal), Commitment Change (Cashless Roll, Decrease, Increase), Fee Payment (Ongoing Fee, Letter of Credit Fee), Money Movement-Inbound (Principal, Interest, Principal + Interest, Principal+Interest+Fee), Money Movement - Outbound (Timebound, Foreign Currency)
    
    Email Description:
    {email}

    Output in JSON format:
    {{
        "request_type": "",
        "sub_request_type": "",
        "sender_address": "",
        "primary_request: "",
        "key_values": keypoints in json format.
    }}
    """
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
