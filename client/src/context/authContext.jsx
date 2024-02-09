import { createContext, useContext, useState } from "react";
import { makeRequest } from "../axios";
import { useSocketContext } from "./socketContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const { socket } = useSocketContext()

    const login = async (values, google) => {
        try {
            let res = null;
            if (values) {
                res = await makeRequest.post("/auth/login", values);
            }

            if (google) {
                res = await makeRequest.get("/auth/user").catch((err) => console.log(err));
            }

            if (res && res.data) {
                localStorage.setItem("user", JSON.stringify(res.data));
                socket.connect();
                socket?.emit("userLogin", res.data)
                setCurrentUser(res.data);
                return res
            }
        } catch (error) {
            console.error(error);
            return error
        }
    };

    const logout = async () => {
        socket?.emit("userLogout", currentUser)
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCurrentUser(null);
        await makeRequest.post("/auth/logout").catch(error => console.log(error));
    };
    return <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const { currentUser, login, logout } = useContext(AuthContext);
    return { currentUser, login, logout };
};
