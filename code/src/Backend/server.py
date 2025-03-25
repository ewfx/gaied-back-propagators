from flask import Flask, request, jsonify
from utilities.emails import read_eml_file
from utilities.emails import check_duplicate_email, store_email_details
from utilities.llm import get_ai_explanation

app = Flask(__name__)


@app.route("/process_email", methods=["POST"])
def process_email():
    if "email_file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    email_file = request.files["email_file"]

    if email_file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Read the .eml file content
    email_content = email_file.read().decode("utf-8")

    # Check Duplicate
    existing_details = check_duplicate_email(email_content)
    if existing_details:
        return jsonify({"message": "Duplicate email detected", "extracted_details": existing_details})

    # Process Email
    extracted_info = get_ai_explanation(email=email_content)
    store_email_details(email_content, extracted_info)

    return jsonify({"message": "New email processed", "extracted_details": extracted_info})


if __name__ == "__main__":
    app.run(debug=True)
