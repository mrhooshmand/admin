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

tokens_db = {}

# ============ دیتابیس ============
DATABASE_NAME = "adminData.db"


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

            conn.commit()
            print("✅ Users table created with default users")

        conn.execute('''
                     CREATE TABLE IF NOT EXISTS roles
                     (
                         id
                         INTEGER
                         PRIMARY
                         KEY
                         AUTOINCREMENT,
                         name
                         TEXT
                         UNIQUE
                         NOT
                         NULL,
                         description
                         TEXT,
                         created_at
                         TIMESTAMP
                         DEFAULT
                         CURRENT_TIMESTAMP
                     )
                     ''')
        cursor = conn.execute("SELECT COUNT(*) FROM roles")

        if cursor.fetchone()[0] == 0:
            roles = [
                ("admin", "Administrator Role"),
                ("manager", "Manager Role"),
                ("operator", "Operator Role"),
                ("viewer", "Viewer Role"),
            ]
            conn.executemany("""
                             INSERT INTO roles (name, description)
                             VALUES (?, ?)
                             """, roles)
            conn.commit()
            print("✅ Roles table created with default roles")


init_db()


def create_test_users(count=100):
    with get_db() as conn:
        for i in range(1, count + 1):
            username = f"user_{i}"
            password = "1234"
            email = f"user{i}@example.com"
            full_name = f"User {i}"

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


create_test_users(25)


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
                response = jsonify({"message": "Login successful", "user": user_info})
                response.set_cookie(
                    'token',
                    token,
                    httponly=True,
                    secure=False,  # برای localhost
                    samesite='Lax',
                    max_age=24 * 60 * 60
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


@app.route("/api/users/search", methods=["POST"])
def search_users():
    try:
        data = request.get_json() or {}

        fields = data.get("fields", {})

        page = max(int(data.get("page", 0)), 0)
        page_size = max(int(data.get("pageSize", 20)), 1)

        order = data.get("order", "created_at")
        order_type = data.get("orderType", "desc").upper()

        # ---------- امنیت ----------
        allowed_sort_columns = {
            "id",
            "username",
            "email",
            "full_name",
            "created_at"
        }

        if order not in allowed_sort_columns:
            order = "created_at"

        if order_type not in ["ASC", "DESC"]:
            order_type = "DESC"

        # ---------- Query ----------
        base_query = """
            FROM users
        """

        where = []
        params = []

        username = fields.get("username", "").strip()
        email = fields.get("email", "").strip()
        full_name = fields.get("full_name", "").strip()

        if username:
            where.append("username LIKE ?")
            params.append(f"%{username}%")

        if email:
            where.append("email LIKE ?")
            params.append(f"%{email}%")

        if full_name:
            where.append("full_name LIKE ?")
            params.append(f"%{full_name}%")

        if where:
            base_query += " WHERE " + " AND ".join(where)

        # ---------- Total Count ----------
        count_query = f"""
            SELECT COUNT(*)
            {base_query}
        """
        offset = (page - 1) * page_size
        with get_db() as conn:

            total = conn.execute(
                count_query,
                params
            ).fetchone()[0]

            query = f"""
                SELECT
                    id,
                    username,
                    email,
                    full_name,
                    created_at
                {base_query}
                ORDER BY {order} {order_type}
                LIMIT ?
                OFFSET ?
            """

            cursor = conn.execute(
                query,
                [
                    *params,
                    page_size,
                    offset
                ]
            )

            users = [dict(row) for row in cursor.fetchall()]

        return jsonify({
            "status": "success",
            "message": "",
            "data": users,
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "total": total,
                "totalPages": (total + page_size - 1) // page_size,
                "order": order,
                "orderType": order_type.lower()
            },
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json() or {}
        fields = data.get("fields", {})
        username = fields.get('username')
        password = fields.get('password')
        email = fields.get('email', '')
        full_name = fields.get('full_name', '')

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

            return jsonify(
                {
                    "status": "success",
                    "message": "User created successfully",
                    "data": {
                        "id": new_user["id"],
                        "username": new_user["username"],
                    },
                })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json() or {}
        fields = data.get("fields", {})
        username = fields.get('username', '')
        email = fields.get('email', '')
        full_name = fields.get('full_name', '')
        password = fields.get('password')

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
            print(updated_user)
            return jsonify({
                "status": "success",
                "message": "User updated successfully",
                "data": {
                    "id": updated_user["id"],
                    "username": updated_user["username"],
                },
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


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

            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "User deleted successfully!",
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/users/bulkDelete', methods=['PUT'])
def delete_users():
    try:
        data = request.get_json() or {}
        fields = data.get("fields", {})
        id_list = fields.get("ids", [])

        if not id_list:
            return jsonify({
                "status": "error",
                "message": "No users selected",
            }), 400

        with get_db() as conn:

            placeholders = ",".join("?" for _ in id_list)

            cursor = conn.execute(
                f"""
                SELECT id, username
                FROM users
                WHERE id IN ({placeholders})
                """,
                id_list
            )

            users = cursor.fetchall()

            if not users:
                return jsonify({
                    "status": "error",
                    "message": "No users found",
                }), 404

            for user in users:
                if user["username"] == "admin":
                    return jsonify({
                        "status": "error",
                        "message": "Cannot delete admin user",
                    }), 403

            conn.execute(
                f"""
                DELETE FROM users
                WHERE id IN ({placeholders})
                """,
                id_list
            )

            conn.commit()

        return jsonify({
            "status": "success",
            "message": f"{len(users)} users deleted successfully",
            "data": {
                "ids": id_list,
            },
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route("/api/roles/search", methods=["POST"])
def search_roles():
    try:
        data = request.get_json() or {}

        fields = data.get("fields", {})

        page = max(int(data.get("page", 0)), 0)
        page_size = max(int(data.get("pageSize", 20)), 1)

        order = data.get("order", "created_at")
        order_type = data.get("orderType", "desc").upper()

        # ---------- امنیت ----------
        allowed_sort_columns = {
            "id",
            "name",
            "description",
            "created_at"
        }

        if order not in allowed_sort_columns:
            order = "created_at"

        if order_type not in ["ASC", "DESC"]:
            order_type = "DESC"

        # ---------- Query ----------
        base_query = """
            FROM roles
        """

        where = []
        params = []

        name = fields.get("name", "").strip()
        description = fields.get("description", "").strip()

        if name:
            where.append("name LIKE ?")
            params.append(f"%{name}%")

        if description:
            where.append("description LIKE ?")
            params.append(f"%{description}%")

        if where:
            base_query += " WHERE " + " AND ".join(where)

        # ---------- Total Count ----------
        count_query = f"""
            SELECT COUNT(*)
            {base_query}
        """
        offset = (page - 1) * page_size
        with get_db() as conn:

            total = conn.execute(
                count_query,
                params
            ).fetchone()[0]

            query = f"""
                SELECT
                    id,
                    name,
                    description,
                    created_at
                {base_query}
                ORDER BY {order} {order_type}
                LIMIT ?
                OFFSET ?
            """

            cursor = conn.execute(
                query,
                [
                    *params,
                    page_size,
                    offset
                ]
            )

            roles = [dict(row) for row in cursor.fetchall()]

        return jsonify({
            "status": "success",
            "message": "",
            "data": roles,
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "total": total,
                "totalPages": (total + page_size - 1) // page_size,
                "order": order,
                "orderType": order_type.lower()
            },
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/roles', methods=['POST'])
def create_role():
    try:
        data = request.json
        name = data.get('name')
        description = data.get('description')

        if not name or not description:
            return jsonify({"error": "Name and description required"}), 400

        with get_db() as conn:
            cursor = conn.execute("SELECT id FROM roles WHERE name = ?", (name,))
            if cursor.fetchone():
                return jsonify({"error": "Role already exists"}), 400

            conn.execute('''
                         INSERT INTO roles (name, description)
                         VALUES (?, ?)
                         ''', (name, description))
            conn.commit()

            cursor = conn.execute('SELECT id, name, description, created_at FROM roles WHERE name = ?',
                                  (name,))
            new_role = dict(cursor.fetchone())

            return jsonify(
                {
                    "status": "success",
                    "message": "Role created successfully",
                    "data": {
                        "id": new_role["id"],
                        "name": new_role["name"],
                    },
                })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/roles/<int:role_id>', methods=['PUT'])
def update_role(role_id):
    try:
        data = request.json
        name = data.get('name')
        description = data.get('description')

        with get_db() as conn:
            cursor = conn.execute("SELECT * FROM roles WHERE id = ?", (role_id,))
            role = cursor.fetchone()
            if not role:
                return jsonify({"error": "Role not found"}), 404

            if role['name'] == 'admin':
                return jsonify({"error": "Cannot modify admin role"}), 403

            if not name or not description:
                return jsonify({"error": "Name and Description are required"}), 400

            conn.execute('''
                         UPDATE roles
                         SET name        = ?,
                             description = ?
                         WHERE id = ?
                         ''', (name, description, role_id))

            conn.commit()

            cursor = conn.execute('SELECT id, name, description, created_at FROM roles WHERE id = ?',
                                  (role_id,))

            updated_role = dict(cursor.fetchone())
            return jsonify({
                "status": "success",
                "message": "Role updated successfully",
                "data": {
                    "id": updated_role["id"],
                    "name": updated_role["name"],
                },
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


@app.route('/api/roles/<int:role_id>', methods=['DELETE'])
def delete_role(role_id):
    try:
        with get_db() as conn:
            cursor = conn.execute("SELECT name FROM roles WHERE id = ?", (role_id,))
            role = cursor.fetchone()
            if not role:
                return jsonify({"error": "Role not found"}), 404

            if role['name'] == 'admin':
                return jsonify({"error": "Cannot delete admin role"}), 403

            conn.execute("DELETE FROM roles WHERE id = ?", (role_id,))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "Role deleted successfully!",
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
        }), 500


if __name__ == '__main__':
    print("📍 http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
