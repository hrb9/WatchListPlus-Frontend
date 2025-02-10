# backend/auth_service.py
from flask import request, jsonify
from plexapi.myplex import MyPlexAccount
import sqlite3
import os
from datetime import datetime

def get_db_path():
    db_dir = 'db'
    os.makedirs(db_dir, exist_ok=True)
    return os.path.join(db_dir, 'auth.db')

def create_db():
    conn = sqlite3.connect(get_db_path())
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

def get_token_for_user(user_id):
    conn = sqlite3.connect(get_db_path())
    c = conn.cursor()
    c.execute('SELECT token FROM auth_tokens WHERE user_id = ?', (user_id,))
    result = c.fetchone()
    conn.close()
    return result[0] if result else None

def get_all_users():
    conn = sqlite3.connect(get_db_path())
    c = conn.cursor()
    c.execute('SELECT user_id FROM auth_tokens')
    users = [row[0] for row in c.fetchall()]
    conn.close()
    return users

def get_plex_account(user_id):
    token = get_token_for_user(user_id)
    if not token:
        return None, None
    return MyPlexAccount(token=token), token

def register_auth_service_routes(app):
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

    # Initialize DB on first request
    @app.before_first_request
    def init_db():
        create_db()
