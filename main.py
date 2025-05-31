from src import create_app

# Create the Flask app using the create_app function
app = create_app()

# Entry point of the application
if __name__ == "__main__":
    app.run(debug=True, port=5014, host='0.0.0.0')
