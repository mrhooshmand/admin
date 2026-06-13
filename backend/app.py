from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import secrets
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

SECRET_KEY = "your-secret-key"
tokens_db = {}

# کاربران
users = {
    "admin": {"password": "1234", "email": "admin@example.com", "full_name": "Admin User"},
    "user": {"password": "1234", "email": "user@example.com", "full_name": "Regular User"}
}


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Token missing"}), 401

        token = token.split(' ')[1]
        if token not in tokens_db or tokens_db[token]["expires"] < datetime.now():
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username in users and users[username]["password"] == password:
        token = secrets.token_urlsafe(32)
        tokens_db[token] = {
            "username": username,
            "expires": datetime.now() + timedelta(hours=24)
        }

        user_info = {
            "username": username,
            "email": users[username]["email"],
            "full_name": users[username]["full_name"]
        }

        return jsonify({"token": token, "user": user_info})

    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/me', methods=['GET'])
@token_required
def get_me():
    token = request.headers.get('Authorization').split(' ')[1]
    username = tokens_db[token]["username"]
    user_info = {
        "username": username,
        "email": users[username]["email"],
        "full_name": users[username]["full_name"]
    }
    return jsonify(user_info)


if __name__ == '__main__':
    print("🚀 Flask server starting...")
    print("📍 http://localhost:8000")
    print("🔐 Test users: admin/1234 or user/1234")
    app.run(host='0.0.0.0', port=8000, debug=True)

# 1:cmd: pip install flask flask-cors pyjwt
# 2:cmd: python app.py
