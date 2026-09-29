import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    // Restore authentication when the app loads
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
            setToken(storedToken)
            setIsAuthenticated(true)
        }

        setLoading(false)
    }, [])

    // Save token after successful login
    const setTokens = (newToken) => {
        if (!newToken) {
            return
        }

        localStorage.setItem('accessToken', newToken)
        setToken(newToken)
        setIsAuthenticated(true)
    }

    // Remove token when logging out
    const logout = () => {
        localStorage.removeItem('accessToken')
        setToken(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                loading,
                setTokens,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}