import os
import sqlite3
import requests
from datetime import datetime
from urllib.parse import urlencode
from plexapi.myplex import MyPlexAccount

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

def register_auth_service_routes(app):
    """Register the authentication endpoints on the Flask app."""
    
    @app.route('/activate_script', methods=['POST'])
    def activate_script():
        app_name = "PlexWatchListPlusByBaramFlix0099999"
        unique_client_id = "PlexWatchListPlusByBaramFlix0099999"
        pin_id, auth_url = get_plex_auth_token(app_name, unique_client_id)
        return {
            'auth_url': auth_url,
            'pin_id': pin_id
        }

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
                return {
                    'auth_token': auth_token,
                    'user_id': user_id,
                    'email': email,
                    'status': 'success'
                }
            except Exception as e:
                return {
                    'error': str(e),
                    'status': 'error'
                }, 500
        else:
            return {'auth_token': None, 'status': 'pending'}

    @app.route('/get_user_info/<token>', methods=['GET'])
    def get_user_info(token):
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute('SELECT user_id, created_at, last_used_at FROM auth_tokens WHERE token = ?', (token,))
        result = c.fetchone()
        conn.close()
        if result:
            return {
                'user_id': result[0],
                'created_at': result[1],
                'last_used_at': result[2]
            }
        return {'error': 'Token not found'}, 404
