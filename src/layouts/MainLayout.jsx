import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function MainLayout() {
    const navigate = useNavigate();
    const {logout} = useAuth()
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <div style={{display: "flex", height: "100vh"}}>

            {/* Sidebar */}
            <div style={{width: 200, background: "#005daa", color: "#fff", padding: 20}}>
                <h3 style={{marginBottom: "3rem"}}>Admin Panel</h3>

                <nav>
                    <ul style={{listStyle: "none", padding: 0, textAlign: "left"}}>
                        <li style={{marginBottom: "1rem"}}><Link to="/dashboard"
                                                                 style={{color: "#fff"}}>Dashboard</Link></li>
                        <li style={{marginBottom: "1rem"}}><Link to="/users" style={{color: "#fff"}}>Users</Link></li>
                        <li style={{marginBottom: "1rem"}}><Link to="/profile" style={{color: "#fff"}}>Profile</Link>
                        </li>
                        <hr/>
                        <li>
                            <button style={{
                                backgroundColor: "transparent",
                                outline: "none",
                                border: "none",
                                color: "#fff",
                                padding: "0"
                            }} onClick={handleLogout}>Sign out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{flex: 1, padding: 20, backgroundColor: 'rgba(238,238,238,0.39)'}}>
                <Outlet/>
            </div>

        </div>
    );
}