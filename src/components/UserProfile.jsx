import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setOpen(false);
    };

    if (!user || !token) {
        return (
            <button onClick={() => navigate("/auth")}>
                Sign In
            </button>
        );
    }

    const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* Avatar */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "18px"
                }}
            >
                {avatarLetter}
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "50px",
                        right: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        padding: "10px",
                        width: "200px",
                        zIndex: 100
                    }}
                >
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
