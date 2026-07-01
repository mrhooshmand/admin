from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
from datetime import datetime, timedelta
from functools import wraps
import sqlite3
from contextlib import contextmanager
import random

app = Flask(__name__)

# ============ تنظیمات CORS ============
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})


SECRET_KEY = "your-secret-key"
tokens_db = {}

# ============ دیتابیس ============
DATABASE_NAME = "users.db"


@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """ایجاد جدول کاربران در اولین اجرا"""
    with get_db() as conn:
        conn.execute('''
                     CREATE TABLE IF NOT EXISTS users
                     (
                         id
                         INTEGER
                         PRIMARY
                         KEY
                         AUTOINCREMENT,
                         username
                         TEXT
                         UNIQUE
                         NOT
                         NULL,
                         password
                         TEXT
                         NOT
                         NULL,
                         email
                         TEXT,
                         full_name
                         TEXT,
                         created_at
                         TIMESTAMP
                         DEFAULT
                         CURRENT_TIMESTAMP
                     )
                     ''')

        cursor = conn.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            conn.execute('''
                         INSERT INTO users (username, password, email, full_name)
                         VALUES (?, ?, ?, ?)
                         ''', ("admin", "1234", "admin@example.com", "Admin User"))

            conn.execute('''
                         INSERT INTO users (username, password, email, full_name)
                         VALUES (?, ?, ?, ?)
                         ''', ("user", "1234", "user@example.com", "Regular User"))

            conn.execute('''
                         INSERT INTO users (username, password, email, full_name)
                         VALUES (?, ?, ?, ?)
                         ''', ("public", "1234", "public@example.com", "Public User"))

            conn.commit()
            print("✅ Users table created with default users")


init_db()

def create_test_users(count=100):
    with get_db() as conn:
        for i in range(1, count + 1):
            username = f"testuser{i}"
            password = "1234"
            email = f"testuser{i}@example.com"
            full_name = f"Test User {i}"

            try:
                conn.execute('''
                    INSERT INTO users (username, password, email, full_name)
                    VALUES (?, ?, ?, ?)
                ''', (
                    username,
                    password,
                    email,
                    full_name
                ))

            except sqlite3.IntegrityError:
                pass

        conn.commit()

    print(f"✅ {count} test users created")

    
create_test_users(100)
# ============ API Endpoints ============

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email', '')
    full_name = data.get('full_name', '')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if len(password) < 4:
        return jsonify({"error": "Password must be at least 4 characters"}), 400

    try:
        with get_db() as conn:
            cursor = conn.execute("SELECT id FROM users WHERE username = ?", (username,))
            if cursor.fetchone():
                return jsonify({"error": "Username already exists"}), 400

            conn.execute('''
                         INSERT INTO users (username, password, email, full_name)
                         VALUES (?, ?, ?, ?)
                         ''', (username, password, email, full_name))
            conn.commit()

            token = secrets.token_urlsafe(32)
            tokens_db[token] = {
                "username": username,
                "expires": datetime.now() + timedelta(hours=24)
            }

            user_info = {
                "username": username,
                "email": email,
                "full_name": full_name
            }

            return jsonify({"token": token, "user": user_info}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    try:
        with get_db() as conn:
            cursor = conn.execute(
                "SELECT username, password, email, full_name FROM users WHERE username = ?",
                (username,)
            )
            user = cursor.fetchone()

            if user and user['password'] == password:
                token = secrets.token_urlsafe(32)
                tokens_db[token] = {
                    "username": username,
                    "expires": datetime.now() + timedelta(hours=24)
                }

                user_info = {
                    "username": user['username'],
                    "email": user['email'],
                    "full_name": user['full_name']
                }
                response = jsonify({ "message": "Login successful", "user": user_info})
                response.set_cookie(
                    'token', 
                    token, 
                    httponly=True, 
                    secure=False,  # برای localhost
                    samesite='Lax',
                    max_age=24*60*60
                )
                return response
               
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Logged out successfully"})
    response.delete_cookie('token')
    return response

@app.route('/api/me', methods=['GET'])
def get_me():
    try:
        token = request.cookies.get('token')
        
        if not token:
            return jsonify({"error": "Not authorised, please sign in"}), 401
            
        if token not in tokens_db:
            return jsonify({"error": "Invalid token"}), 401
            
        if tokens_db[token]["expires"] < datetime.now():
            return jsonify({"error": "Token expired"}), 401

        username = tokens_db[token]["username"]

        with get_db() as conn:
            cursor = conn.execute(
                "SELECT username, email, full_name, created_at FROM users WHERE username = ?",
                (username,)
            )
            user = cursor.fetchone()
            if user:
                return jsonify(dict(user))
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        with get_db() as conn:
            cursor = conn.execute('''
                                  SELECT id, username, email, full_name, created_at
                                  FROM users
                                  ORDER BY created_at DESC
                                  ''')
            users_list = [dict(row) for row in cursor.fetchall()]
            return jsonify(users_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        full_name = data.get('full_name', '')

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        if len(password) < 4:
            return jsonify({"error": "Password must be at least 4 characters"}), 400

        with get_db() as conn:
            cursor = conn.execute("SELECT id FROM users WHERE username = ?", (username,))
            if cursor.fetchone():
                return jsonify({"error": "Username already exists"}), 400

            conn.execute('''
                         INSERT INTO users (username, password, email, full_name)
                         VALUES (?, ?, ?, ?)
                         ''', (username, password, email, full_name))
            conn.commit()

            cursor = conn.execute('SELECT id, username, email, full_name, created_at FROM users WHERE username = ?',
                                  (username,))
            new_user = dict(cursor.fetchone())

            return jsonify(new_user), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        username = data.get('username', '')
        email = data.get('email', '')
        full_name = data.get('full_name', '')
        password = data.get('password')

        with get_db() as conn:
            cursor = conn.execute("SELECT username FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            if user['username'] == 'admin':
                return jsonify({"error": "Cannot modify admin user"}), 403

            if username:
                if password:
                    conn.execute('''
                                 UPDATE users
                                 SET email     = ?,
                                     full_name = ?,
                                     password  = ?,
                                     username  = ?
                                 WHERE id = ?
                                 ''', (email, full_name, password, username, user_id))
                else:
                    conn.execute('''
                                 UPDATE users
                                 SET email     = ?,
                                     full_name = ?,
                                     username  = ?
                                 WHERE id = ?
                                 ''', (email, full_name, username, user_id))
            else:
                if password:
                    conn.execute('''
                                 UPDATE users
                                 SET email     = ?,
                                     full_name = ?,
                                     password  = ?
                                 WHERE id = ?
                                 ''', (email, full_name, password, user_id))
                else:
                    conn.execute('''
                                 UPDATE users
                                 SET email     = ?,
                                     full_name = ?
                                 WHERE id = ?
                                 ''', (email, full_name, user_id))

            conn.commit()

            cursor = conn.execute('SELECT id, username, email, full_name, created_at FROM users WHERE id = ?',
                                  (user_id,))
            updated_user = dict(cursor.fetchone())

            return jsonify(updated_user)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        with get_db() as conn:
            cursor = conn.execute("SELECT username FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            if user['username'] == 'admin':
                return jsonify({"error": "Cannot delete admin user"}), 403

            cursor = conn.execute("SELECT username FROM users WHERE id = ?", (user_id,))

            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()

            return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("🚀 Flask server starting with SQLite database...")
    print("📍 http://localhost:8000")
    print("🔐 Test users: admin/1234 or user/1234")
    app.run(host='0.0.0.0', port=8000, debug=True)
