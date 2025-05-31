from flask import Blueprint, request, jsonify, render_template, session
from src.service.response_generator import generate_response

# Define a Flask Blueprint named 'main_bp'
main_bp = Blueprint("main_bp", __name__)

# Route for the index page, supports GET and POST methods
@main_bp.route("", methods=["GET", "POST"])
@main_bp.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        user_input = request.form["answer"]
        assistant_response = generate_response(user_input)
        return jsonify(assistant_response)
    # intialize messages in session storage
    session["messages"] = []
    # Render the index.html template for GET requests
    return render_template("index.html")
