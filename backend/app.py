import os
from flask import Flask, send_from_directory
from auth_service import register_auth_service_routes

# Initialize the Flask application with the static folder pointing to your React build output.
app = Flask(__name__, static_folder='build', static_url_path='')

# Register authentication routes from auth_service.
register_auth_service_routes(app)

# Catch-all route to serve the React frontend.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # If the requested path exists in the static folder, serve it.
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve index.html (letting React Router handle the route).
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Run on all interfaces at port 5332
    app.run(host='0.0.0.0', port=5332, debug=True)
