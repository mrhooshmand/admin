from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
from datetime import datetime, timedelta
from functools import wraps
import sqlite3
from contextlib import contextmanager
import copy
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
                response = jsonify({"message": "Login successful", "user": user_info,
                                    "menus":
                                        [
                                            {
                                                "id": 783,
                                                "code": "roles",
                                                "title": "Roles"
                                            },
                                            {
                                                "id": 784,
                                                "code": "users",
                                                "title": "Users"
                                            },
                                            {
                                                "id": 1,
                                                "code": "profile",
                                                "title": "Profile"
                                            }
                                        ]})
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


@app.get("/api/menus")
def menus():
    try:
        return jsonify({
            "status": "success",
            "message": "",
            "data": [
                {
                    "id": 784,
                    "code": "users",
                    "title": "Users"
                },
                {
                    "id": 785,
                    "code": "roles",
                    "title": "Roles"
                }
            ]
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "data": []
        }), 500


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


# ============ سطوح دسترسی و IP مجاز (داده فیک) ============

ACCESS_MODULES = [
    {"id": "gds", "title": "GDS"},
    {"id": "inventory", "title": "موجودی"},
    {"id": "finance", "title": "مالی"},
    {"id": "report", "title": "گزارش‌ها"},
]

PERMISSION_CATALOG = {
    "gds": {
        "id": "gds",
        "title": "GDS",
        "childs": [
            {
                "id": "gds-search",
                "title": "جستجوی پرواز",
                "operations": [
                    {"id": "gds.search.view", "title": "مشاهده"},
                    {"id": "gds.search.create", "title": "ثبت"},
                ],
            },
            {
                "id": "gds-book",
                "title": "رزرو",
                "operations": [
                    {"id": "gds.book.view", "title": "مشاهده"},
                    {"id": "gds.book.edit", "title": "ویرایش"},
                    {"id": "gds.book.cancel", "title": "لغو"},
                ],
            },
        ],
    },
    "inventory": {
        "id": "inventory",
        "title": "موجودی",
        "childs": [
            {
                "id": "inventory-flight",
                "title": "پرواز",
                "operations": [
                    {"id": "inventory.flight.view", "title": "مشاهده"},
                    {"id": "inventory.flight.edit", "title": "ویرایش"},
                ],
            },
            {
                "id": "inventory-class",
                "title": "کلاس نرخی",
                "operations": [
                    {"id": "inventory.class.view", "title": "مشاهده"},
                    {"id": "inventory.class.edit", "title": "ویرایش"},
                ],
            },
        ],
    },
    "finance": {
        "id": "finance",
        "title": "مالی",
        "childs": [
            {
                "id": "finance-invoice",
                "title": "فاکتور",
                "operations": [
                    {"id": "finance.invoice.view", "title": "مشاهده"},
                    {"id": "finance.invoice.create", "title": "ثبت"},
                ],
            },
        ],
    },
    "report": {
        "id": "report",
        "title": "گزارش‌ها",
        "childs": [
            {
                "id": "report-sales",
                "title": "فروش",
                "operations": [
                    {"id": "report.sales.view", "title": "مشاهده"},
                    {"id": "report.sales.export", "title": "خروجی"},
                ],
            },
        ],
    },
}

ACCESS_LEVELS = [
    {
        "id": 1,
        "title": "مدیر آژانس",
        "role": "agency-admin",
        "module": "gds,inventory",
        "status": 1,
        "customer": "ادمین",
        "permissions": ["gds.search.view", "gds.search.create", "gds.book.view", "inventory.flight.view"],
    },
    {
        "id": 2,
        "title": "اپراتور رزرو",
        "role": "booking-operator",
        "module": "gds",
        "status": 1,
        "customer": "ادمین",
        "permissions": ["gds.search.view", "gds.book.view", "gds.book.edit"],
    },
    {
        "id": 3,
        "title": "حسابدار",
        "role": "accountant",
        "module": "finance,report",
        "status": 1,
        "customer": "مالی",
        "permissions": ["finance.invoice.view", "finance.invoice.create", "report.sales.view"],
    },
    {
        "id": 4,
        "title": "پشتیبان",
        "role": "support",
        "module": "gds,report",
        "status": 0,
        "customer": "پشتیبانی",
        "permissions": ["gds.search.view", "report.sales.view"],
    },
    {
        "id": 5,
        "title": "ناظر موجودی",
        "role": "inventory-viewer",
        "module": "inventory",
        "status": 1,
        "customer": "ادمین",
        "permissions": ["inventory.flight.view", "inventory.class.view"],
    },
    {
        "id": 6,
        "title": "مدیر فروش",
        "role": "sales-manager",
        "module": "gds,finance,report",
        "status": 1,
        "customer": "فروش",
        "permissions": ["gds.search.view", "gds.book.view", "report.sales.view", "report.sales.export"],
    },
]

ROLE_USERS = {
    1: [
        {"name": "ali.rezaei", "status": "enable"},
        {"name": "sara.karimi", "status": "enable"},
        {"name": "office.user", "status": "block"},
    ],
    2: [
        {"name": "reza.operator", "status": "enable"},
        {"name": "mina.salehi", "status": "disable"},
    ],
    3: [
        {"name": "hesabdar", "status": "enable"},
    ],
    5: [
        {"name": "inventory.viewer", "status": "enable"},
    ],
    6: [
        {"name": "sales.lead", "status": "enable"},
        {"name": "sales.agent", "status": "disable"},
    ],
}

WS_ALLOWED_IPS = [
    {
        "id": 1,
        "customer": "آژانس سپهر",
        "ip": "185.12.14.20,185.12.14.21",
        "user": "sepehr_ws",
        "pass": "Sepehr#1404",
        "software_name": "Amadeus",
        "status": 1,
        "en": "فعال",
        "block_status": "آزاد",
    },
    {
        "id": 2,
        "customer": "آژانس پارسیان",
        "ip": "91.99.101.14",
        "user": "parsian_ws",
        "pass": "Parsian#1404",
        "software_name": "Sabre",
        "status": 1,
        "en": "فعال",
        "block_status": "آزاد",
    },
    {
        "id": 3,
        "customer": "چارتر آسمان",
        "ip": "5.160.22.80,5.160.22.81",
        "user": "aseman_ws",
        "pass": "Aseman#1404",
        "software_name": "Charter",
        "status": 0,
        "en": "غیرفعال",
        "block_status": "مسدود",
    },
    {
        "id": 4,
        "customer": "آژانس نیک‌پرواز",
        "ip": "178.22.120.9",
        "user": "nikparvaz_ws",
        "pass": "Nik#1404",
        "software_name": "Galileo",
        "status": 1,
        "en": "فعال",
        "block_status": "آزاد",
    },
    {
        "id": 5,
        "customer": "دفتر مشهد",
        "ip": "79.175.140.33",
        "user": "mashhad_ws",
        "pass": "Mashhad#1404",
        "software_name": "Amadeus",
        "status": 1,
        "en": "فعال",
        "block_status": "محدود",
    },
    {
        "id": 6,
        "customer": "آژانس کیش",
        "ip": "188.121.44.10",
        "user": "kish_ws",
        "pass": "Kish#1404",
        "software_name": "",
        "status": 0,
        "en": "غیرفعال",
        "block_status": "آزاد",
    },
]

SOFTWARE_NAMES = [
    {"id": "amadeus", "title": "Amadeus"},
    {"id": "sabre", "title": "Sabre"},
    {"id": "galileo", "title": "Galileo"},
    {"id": "charter", "title": "Charter"},
]

FLIGHT_ROUTES = [
    {"id": "THR", "title": "تهران (THR)"},
    {"id": "MHD", "title": "مشهد (MHD)"},
    {"id": "IFN", "title": "اصفهان (IFN)"},
    {"id": "SYZ", "title": "شیراز (SYZ)"},
    {"id": "KIH", "title": "کیش (KIH)"},
    {"id": "TBZ", "title": "تبریز (TBZ)"},
    {"id": "AWZ", "title": "اهواز (AWZ)"},
]

_next_access_level_id = max(row["id"] for row in ACCESS_LEVELS) + 1


def trex_ok(message="", data=None, extra=None):
    body = {"err": 0, "msg": message, "data": data}
    if extra:
        body.update(extra)
    return body


def trex_error(message, status=400):
    return jsonify({"err": 1, "msg": message, "data": None}), status


def paginate_rows(rows, start, page_size):
    try:
        start = max(int(start), 0)
    except (TypeError, ValueError):
        start = 0
    try:
        page_size = max(int(page_size), 1)
    except (TypeError, ValueError):
        page_size = 20

    total = len(rows)
    last_page = max((total + page_size - 1) // page_size, 1)
    return {
        "err": 0,
        "msg": "",
        "data": rows[start:start + page_size],
        "pagination": {
            "currentPage": (start // page_size) + 1,
            "lastPage": last_page,
            "total": total,
        },
    }


def sort_rows(rows, order, order_type, allowed):
    key = order if order in allowed else "id"
    reverse = str(order_type or "desc").lower() != "asc"

    def sort_key(row):
        value = row.get(key)
        if isinstance(value, (int, float)):
            return (0, value)
        return (1, str(value or "").lower())

    return sorted(rows, key=sort_key, reverse=reverse)


def public_access_level(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "role": row["role"],
        "module": row["module"],
        "status": row["status"],
        "customer": row["customer"],
    }


def public_allowed_ip(row):
    return {
        "id": row["id"],
        "customer": row["customer"],
        "ip": row["ip"],
        "user": row["user"],
        "pass": row["pass"],
        "software_name": row["software_name"],
        "status": row["status"],
        "en": row["en"],
        "block_status": row["block_status"],
    }


def permission_tree(module_ids, checked_ids):
    checked = set(checked_ids or [])
    nodes = []
    for module_id in module_ids:
        source = PERMISSION_CATALOG.get(module_id)
        if not source:
            continue
        node = copy.deepcopy(source)
        for child in node.get("childs", []):
            for operation in child.get("operations", []):
                operation["checked"] = 1 if operation["id"] in checked else 0
        nodes.append(node)
    return nodes


def find_access_level(level_id):
    return next((row for row in ACCESS_LEVELS if row["id"] == level_id), None)


def find_allowed_ip(row_id):
    return next((row for row in WS_ALLOWED_IPS if row["id"] == row_id), None)


def software_title(value):
    match = next(
        (item for item in SOFTWARE_NAMES if item["id"] == value or item["title"] == value),
        None,
    )
    return match["title"] if match else value


@app.route("/api/GDS/access/level/search", methods=["POST"])
def search_access_levels():
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    title = str(fields.get("title") or "").strip().lower()
    status = str(fields.get("status", "-1"))

    rows = ACCESS_LEVELS
    if title:
        rows = [row for row in rows if title in row["title"].lower() or title in row["role"].lower()]
    if status in ("0", "1"):
        rows = [row for row in rows if str(row["status"]) == status]

    rows = sort_rows(
        rows,
        data.get("order", "id"),
        data.get("orderType", "desc"),
        {"id", "title", "role", "module", "status", "customer"},
    )
    return jsonify(paginate_rows(
        [public_access_level(row) for row in rows],
        data.get("start", 0),
        data.get("pageSize", 20),
    ))


@app.route("/api/GDS/access/level/getModules", methods=["POST"])
def get_access_modules():
    return jsonify(trex_ok(data=ACCESS_MODULES))


@app.route("/api/GDS/access/level/getLevelInfo/<int:level_id>", methods=["POST"])
def get_access_level_info(level_id):
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    modules = fields.get("module") or []
    if isinstance(modules, str):
        modules = [item for item in modules.split(",") if item]

    level = find_access_level(level_id)
    checked = level["permissions"] if level else []
    if not modules and level:
        modules = [item for item in level["module"].split(",") if item]

    return jsonify(trex_ok(extra={
        "title": level["title"] if level else "",
        "status": level["status"] if level else 1,
        "permissions": permission_tree(modules, checked),
    }))


@app.route("/api/GDS/access/level/update/<int:level_id>", methods=["POST"])
def save_access_level(level_id):
    global _next_access_level_id
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    title = str(fields.get("title") or "").strip()
    roles = fields.get("roles") or []
    if isinstance(roles, str):
        roles = [item for item in roles.split(",") if item]
    status = 1 if str(fields.get("status", "1")) == "1" else 0
    permissions = fields.get("permissions") or []

    if not title:
        return trex_error("Title is required")
    if not roles:
        return trex_error("Select a module")

    if level_id == 0:
        row = {
            "id": _next_access_level_id,
            "title": title,
            "role": title,
            "module": ",".join(roles),
            "status": status,
            "customer": "ادمین",
            "permissions": list(permissions),
        }
        _next_access_level_id += 1
        ACCESS_LEVELS.insert(0, row)
        ROLE_USERS[row["id"]] = []
        return jsonify(trex_ok("Access level created"))

    row = find_access_level(level_id)
    if not row:
        return trex_error("Access level not found", 404)

    row["title"] = title
    row["role"] = title
    row["module"] = ",".join(roles)
    row["status"] = status
    row["permissions"] = list(permissions)
    return jsonify(trex_ok("Access level updated"))


@app.route("/api/GDS/access/level/delete/<int:level_id>", methods=["POST"])
def delete_access_level(level_id):
    row = find_access_level(level_id)
    if not row:
        return trex_error("Access level not found", 404)
    ACCESS_LEVELS.remove(row)
    ROLE_USERS.pop(level_id, None)
    return jsonify(trex_ok("Access level deleted"))


@app.route("/api/GDS/access/account/getRoleUsersList/<int:level_id>", methods=["POST"])
def get_role_users(level_id):
    if not find_access_level(level_id):
        return jsonify(trex_ok(data=[]))
    return jsonify(trex_ok(data=ROLE_USERS.get(level_id, [])))


@app.route("/api/GDS/access/WSAllowedIP/search", methods=["POST"])
def search_ws_allowed_ips():
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    keyword = str(fields.get("keyword") or "").strip().lower()

    rows = WS_ALLOWED_IPS
    if keyword:
        rows = [
            row for row in rows
            if keyword in row["customer"].lower()
            or keyword in row["ip"].lower()
            or keyword in row["user"].lower()
            or keyword in row["software_name"].lower()
        ]

    rows = sort_rows(rows, "id", "desc", {"id"})
    return jsonify(paginate_rows(
        [public_allowed_ip(row) for row in rows],
        data.get("start", 0),
        data.get("pageSize", 20),
    ))


@app.route("/api/GDS/access/WSAllowedIP/getSoftwareNames", methods=["POST"])
def get_software_names():
    return jsonify(trex_ok(data=SOFTWARE_NAMES))


@app.route("/api/GDS/access/WSAllowedIP/save", methods=["POST"])
def save_ws_software():
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    try:
        row_id = int(fields.get("id"))
    except (TypeError, ValueError):
        return trex_error("Invalid id")

    row = find_allowed_ip(row_id)
    if not row:
        return trex_error("Allowed IP not found", 404)

    software_name = str(fields.get("software_name") or "").strip()
    if not software_name:
        return trex_error("Software is required")

    row["software_name"] = software_title(software_name)
    return jsonify(trex_ok("Software updated"))


@app.route("/api/GDS/access/WSAllowedIP/checkWSUser", methods=["POST"])
def check_ws_user():
    data = request.get_json(silent=True) or {}
    fields = data.get("fields") or {}
    try:
        row_id = int(fields.get("id"))
    except (TypeError, ValueError):
        return trex_error("Invalid id")

    row = find_allowed_ip(row_id)
    if not row:
        return trex_error("Allowed IP not found", 404)
    if row["status"] != 1:
        return trex_error("User is inactive")

    departure = fields.get("search_flight_departure") or ""
    arrival = fields.get("search_flight_arrival") or ""
    return jsonify(trex_ok(f"User {row['user']} is allowed for {departure}-{arrival}"))


@app.route("/api/GDS/inventory/priceClass/get_routes_by_airline", methods=["POST"])
def get_routes_by_airline():
    return jsonify(trex_ok(data=FLIGHT_ROUTES))


if __name__ == '__main__':
    print("📍 http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
