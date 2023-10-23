import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { makeRequest } from "../axios";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || false)

    const login = async ({ username, password }) => {
        try {
            const credentials = { username, password }
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, credentials, {
                withCredentials: true
            })
            setCurrentUser(response.data)

        } catch (error) {
            throw new Error(error.response.data)
        }
    }

    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`)
            setCurrentUser(null)
            localStorage.clear()
        } catch (error) {
            console.log(error.message)
        }
    }

    const checkAuth = async () => {
        try {
            const response = await makeRequest.get('auth/checkauth')
        } catch (error) {
            setCurrentUser(false)
        }
    }

    useEffect(() => {
        checkAuth()
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}