# backend/app.py
import os
from flask import Flask, send_from_directory
from auth_service import register_auth_service_routes
from container_manager import register_container_manager_routes

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")

# Register API routes from external modules
register_auth_service_routes(app)
register_container_manager_routes(app)

@app.route('/')
def index():
    # Serve the React build index.html
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5332))
    app.run(host='0.0.0.0', port=port, debug=True)
