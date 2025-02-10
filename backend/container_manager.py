# backend/container_manager.py
from flask import request, jsonify
import json
import os
import subprocess

SERVICES_JSON_PATH = "services_list.json"

def load_services():
    if not os.path.exists(SERVICES_JSON_PATH):
        return []
    with open(SERVICES_JSON_PATH, "r") as f:
        return json.load(f)

def save_services(services):
    with open(SERVICES_JSON_PATH, "w") as f:
        json.dump(services, f, indent=2)

def register_container_manager_routes(app):
    @app.route("/containers/list", methods=["GET"])
    def list_microservices():
        services = load_services()
        return jsonify(services)

    @app.route("/containers/install_or_update", methods=["POST"])
    def install_or_update():
        data = request.json
        service_name = data.get("service_name")
        action = data.get("action")

        services = load_services()
        svc = next((s for s in services if s["name"] == service_name), None)
        if not svc:
            return jsonify({"success": False, "error": "Service not found"}), 404

        try:
            if action == "install":
                # Example: run a command to install the service (this is a placeholder)
                svc["installed"] = True
            elif action == "update":
                # Example: run a command to update the service (this is a placeholder)
                pass
            else:
                return jsonify({"success": False, "error": "Invalid action"}), 400

            save_services(services)
            return jsonify({"success": True})
        except subprocess.CalledProcessError as e:
            return jsonify({"success": False, "error": str(e)}), 500
