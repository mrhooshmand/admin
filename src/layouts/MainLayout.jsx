import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
    return (
        <div style={{ display: "flex", height: "100vh" }}>

            {/* Sidebar */}
            <div style={{ width: 200, background: "#111", color: "#fff", padding: 20 }}>
                <h3>Admin Panel</h3>

                <nav>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li><Link to="/" style={{ color: "#fff" }}>Dashboard</Link></li>
                        <li><Link to="/users" style={{ color: "#fff" }}>Users</Link></li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </div>

        </div>
    );
}