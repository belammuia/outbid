import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
            setToken(storedToken)
            setIsAuthenticated(true)
            getMe(storedToken)
        } else {
            setLoading(false)
        }
    }, [])


    const getMe = async (accessToken) => {
        try {
            const response = await axios.get(
                'http://localhost:8001/api/auth/v1/whoami/',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )

            setUser(response.data)
        } catch (error) {
            console.error('Failed to get current user:', error)

            localStorage.removeItem('accessToken')
            setToken(null)
            setIsAuthenticated(false)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const setTokens = (newToken) => {
        if (!newToken) {
            return
        }

        localStorage.setItem('accessToken', newToken)
        setToken(newToken)
        setIsAuthenticated(true)

        getMe(newToken)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        setToken(null)
        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                setTokens,
                getMe,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

