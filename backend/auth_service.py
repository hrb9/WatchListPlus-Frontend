# auth_service.py
from flask import Flask, request, jsonify
from plexapi.myplex import MyPlexAccount
import sqlite3
import os

def register_auth_service_routes(app):
    # Instead of using @app.before_first_request, call initialization immediately.
    init_auth()

    @app.route('/connect', methods=['POST'])
    def connect():
        data = request.json
        user_id = data.get('user_id')
        connection_type = data.get('type')
        try:
            if connection_type == 'users':
                users = get_all_users()
                return jsonify({'users': users})
            
            account, token = get_plex_account(user_id)
            if not account:
                return jsonify({'error': 'Token not found for user'}), 404
            elif connection_type == 'account':
                return jsonify({
                    'token': token,
                    'account': {
                        'username': account.username,
                        'email': account.email
                    }
                })
            else:
                return jsonify({'error': 'Invalid connection type'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

def init_auth():
    # One-time initialization logic—for example, create the database.
    create_db()

def create_db():
    db_dir = 'db'
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, 'auth.db')
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

def get_db_path():
    db_dir = 'db'
    os.makedirs(db_dir, exist_ok=True)
    return os.path.join(db_dir, 'auth.db')

def get_token_for_user(user_id):
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT token FROM auth_tokens WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None

def get_all_users():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT user_id FROM auth_tokens')
    users = [row[0] for row in cursor.fetchall()]
    conn.close()
    return users

def get_plex_account(user_id):
    token = get_token_for_user(user_id)
    if not token:
        return None, None
    return MyPlexAccount(token=token), token
