import google.generativeai as genai
import os
from dotenv import load_dotenv

def get_ai_explanation(model_name="gemini-2.0-flash", email="Explain how AI works"):
    
    load_dotenv()  
    api_key = os.getenv("GENAI_API_KEY")

    if not api_key:
        print("Error: GENAI_API_KEY not found in environment variables.")
        return None
    prompt = f"""Analyse the following email and give me the outputs in the following json format
    
    -   Summary: A concise summary of the email's content.
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
        "summary": "",
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

if __name__ == "__main__":
    emails="""
    Sender: Shivaram@gmail.com
    Subject: Quick Question Regarding Inbound Funds

    Hey Finance Team,

    Hope you're all having a good day. Just wanted to quickly get something sorted out. We're looking to move some funds into our account, specifically the principal and the interest accrued. The total should be around $150,000, broken down as $100,000 for the principal and $50,000 for the interest. 

    The account number we're referring to is 1234567890. If you could let me know the best way to get this processed, that would be great.

    Our office address is 456 Oak Ave, Anytown, CA 98765.

    Thanks,
    Shivaram
    """
    explanation = get_ai_explanation(email=emails)
    if explanation:
        print(explanation)