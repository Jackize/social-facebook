import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const navigate = useNavigate();
    const login = async (values, google) => {
        let res = null;
        if (values) {
            res = await makeRequest.post("/auth/login", values);
        }

        if (google) {
            res = await makeRequest.get("/auth/user").catch((err) => console.log(err));
        }

        if (res && res.data) {
            makeRequest.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));
            setCurrentUser(res.data);
            navigate("/");
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCurrentUser(null);
        navigate("/login");
    };

    const handleResetUser = (user) => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        window.location.reload();
    };
    return <AuthContext.Provider value={{ handleResetUser, currentUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const { handleResetUser, currentUser, login, logout } = useContext(AuthContext);
    return { handleResetUser, currentUser, login, logout };
};
