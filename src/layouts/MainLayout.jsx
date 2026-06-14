import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import FullPageLoading from "../components/FullPageLoading";
import {useLoading} from "../context/LoadingContext";
import {useEffect} from "react";
import {ROUTES} from "../constants/routes";

export default function MainLayout() {
    const navigate = useNavigate();
    const {isLoading, message} = useLoading();
    const {logout, token} = useAuth()
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    useEffect(() => {
        if (!token) {
            navigate(ROUTES.LOGIN);
        }
    }, [token, navigate]);
    return (
        <div style={{display: "flex", height: "100vh"}}>
            {isLoading && <FullPageLoading message={message}/>}

            {/* Sidebar */}
            <div id="sidebar" style={{width: 200, padding: 20}}>
                <h3 style={{marginBottom: "3rem"}}>Admin Panel</h3>
                <nav>
                    <ul style={{listStyle: "none", padding: 0, textAlign: "left"}}>
                        <li style={{marginBottom: "1rem"}}><Link to="/dashboard"
                                                                 style={{color: "#fff"}}>Dashboard</Link></li>
                        <li style={{marginBottom: "1rem"}}><Link to="/users" style={{color: "#fff"}}>Users</Link></li>
                        <li style={{marginBottom: "1rem"}}><Link to="/profile" style={{color: "#fff"}}>Profile</Link>
                        </li>
                    </ul>
                </nav>
                <button className="btn-grad" onClick={handleLogout}>Sign out</button>
            </div>

            {/* Main Content */}
            <div style={{flex: 1, padding: 20, backgroundColor: 'rgba(238,238,238,0.39)'}}>
                <Outlet/>
            </div>

        </div>
    );
}