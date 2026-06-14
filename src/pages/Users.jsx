import {useState, useEffect} from "react";
import {getUsers} from "../api/userApi";
import {useLoading} from "../context/LoadingContext";
import {showAlert} from "../utils/errorHandler";

export default function Users() {
    const [users, setUsers] = useState([]);
    const {showLoading, hideLoading} = useLoading();
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        showLoading();
        try {
            const response = await getUsers();
            setUsers(response.data);
            setError("");
        } catch (err) {
            showAlert("error", err);
        } finally {
            hideLoading();
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>{error}</div>
                <button onClick={fetchUsers} style={styles.button}>Retry</button>
            </div>
        );
    }

    const handleEditUser = (user) => {
        console.log(user)
    }

    return (
        <div style={styles.container}>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index = 1) => (
                    <tr key={user.id || user.username}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td style={{whiteSpace: 'nowrap'}}>
                            {user.username !== 'admin' &&
                                <button style={{marginRight: '0.25rem'}}
                                        onClick={() => handleEditUser(user)}>✏️</button>}
                            <button>🗑️</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        padding: "50px",
        maxWidth: "800px",
        margin: "0 auto",
    },
    userList: {
        marginTop: "20px",
    },
    userCard: {
        display: "flex",
        alignItems: "center",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        gap: "20px",
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#4CAF50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "bold",
    },
    userInfo: {
        flex: 1,
    },
    error: {
        color: "red",
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};