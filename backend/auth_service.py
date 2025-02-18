import os
from flask import Flask, jsonify, send_from_directory, request
import requests
import sqlite3
from urllib.parse import urlencode
from datetime import datetime
from plexapi.myplex import MyPlexAccount

# Create the Flask app and set the static folder to the React build output.
# (In production, the Dockerfile should copy the React build into ./build)
app = Flask(__name__, static_folder='build', static_url_path='')

def get_db_path():
    """Get database path in main db directory"""
    db_dir = 'db'
    os.makedirs(db_dir, exist_ok=True)
    return os.path.join(db_dir, 'auth.db')

def create_db():
    """Create auth database with user tracking"""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS auth_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_used_at TIMESTAMP,
            UNIQUE(token, user_id)
        )
    ''')
    conn.commit()
    conn.close()

def get_plex_auth_token(app_name, unique_client_id):
    """Initialize Plex authentication process"""
    r = requests.post(
        "https://plex.tv/api/v2/pins",
        headers={"Accept": "application/json"},
        data={
            "strong": "true",
            "X-Plex-Product": app_name,
            "X-Plex-Client-Identifier": unique_client_id,
        },
    )
    r_json = r.json()
    pin_id, pin_code = r_json["id"], r_json["code"]
    encoded_params = urlencode({
        "clientID": unique_client_id,
        "code": pin_code,
        "context[device][product]": app_name,
    })
    auth_url = f"https://app.plex.tv/auth#?{encoded_params}"
    return pin_id, auth_url

def update_token_usage(token, user_id):
    """Update last used timestamp for token"""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('''
        UPDATE auth_tokens 
        SET last_used_at = ? 
        WHERE token = ? AND user_id = ?
    ''', (datetime.now(), token, user_id))
    conn.commit()
    conn.close()

@app.route('/activate_script', methods=['POST'])
def activate_script():
    app_name = "PlexWatchListPlusByBaramFlix0099999"
    unique_client_id = "PlexWatchListPlusByBaramFlix0099999"
    pin_id, auth_url = get_plex_auth_token(app_name, unique_client_id)
    return jsonify({'auth_url': auth_url, 'pin_id': pin_id})

@app.route('/check_token/<pin_id>', methods=['GET'])
def check_token(pin_id):
    unique_client_id = "PlexWatchListPlusByBaramFlix0099999"
    r = requests.get(
        f"https://plex.tv/api/v2/pins/{pin_id}",
        headers={"Accept": "application/json"},
        params={"X-Plex-Client-Identifier": unique_client_id}
    )
    r_json = r.json()
    auth_token = r_json.get("authToken")
    if auth_token:
        try:
            plex_account = MyPlexAccount(token=auth_token)
            user_id = plex_account.username
            email = plex_account.email
            create_db()
            db_path = get_db_path()
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('''
                INSERT OR REPLACE INTO auth_tokens (token, user_id, created_at, last_used_at)
                VALUES (?, ?, ?, ?)
            ''', (auth_token, user_id, datetime.now(), datetime.now()))
            conn.commit()
            conn.close()
            return jsonify({
                'auth_token': auth_token,
                'user_id': user_id,
                'email': email,
                'status': 'success'
            })
        except Exception as e:
            return jsonify({'error': str(e), 'status': 'error'}), 500
    else:
        return jsonify({'auth_token': None, 'status': 'pending'})

@app.route('/get_user_info/<token>', methods=['GET'])
def get_user_info(token):
    """Get user information for a given token"""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('SELECT user_id, created_at, last_used_at FROM auth_tokens WHERE token = ?', (token,))
    result = c.fetchone()
    conn.close()
    if result:
        return jsonify({
            'user_id': result[0],
            'created_at': result[1],
            'last_used_at': result[2]
        })
    return jsonify({'error': 'Token not found'}), 404

# ---------------------------
# Catch-All Route to Serve React Frontend
# ---------------------------
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """
    Serve static files from the React build folder.
    If the requested path doesn't exist, serve index.html for the React router.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Run on all interfaces on port 5332
    app.run(host='0.0.0.0', port=5332, debug=True)
