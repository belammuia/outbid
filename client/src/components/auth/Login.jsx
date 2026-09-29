import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { setTokens } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = 'http://localhost:8001/api/auth/v1/login/'

            const response = await axios.post(url, {
                email,
                password,
            })

            setTokens(response.data.access)

            console.log('Success! Dashboard to be implemented next')
            nav('/dashboard')
        } catch (error) {
            console.error(
                error.response?.data?.detail || 'Login failed'
            )
        }
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>Welcome Back</h1>

                    <div>
                        <label>Email*</label>
                        <input
                            type="email"
                            placeholder="e.g johndoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password*</label>
                        <input
                            type="password"
                            placeholder="e.g Statesman!23"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login