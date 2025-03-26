from flask import Flask, request, jsonify
from utilities.emails import read_eml_file
from utilities.emails import check_duplicate_email, store_email_details
from utilities.llm import get_ai_explanation
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)



@app.route("/process_email", methods=["POST"])
def process_email():
    if "email_file" not in request.files:
        print('No file part')
        return jsonify({"error": "No file part"}), 400

    email_file = request.files["email_file"]

    if email_file.filename == "":
        print('No selected file')
        return jsonify({"error": "No selected file"}), 400


    email_content = email_file.read().decode("utf-8")


    existing_details = check_duplicate_email(email_content)
    if existing_details:
        print(existing_details)
        return jsonify(existing_details),200


    extracted_info = json.loads(get_ai_explanation(email=email_content))
    store_email_details(email_content, extracted_info)
    print(extracted_info)
    return jsonify(extracted_info),200


if __name__ == "__main__":
    app.run(debug=True)
