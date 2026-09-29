import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            const url = 'http://localhost:8001/api/auth/v1/signup/'
            const response = await axios.post(
                url,
                {
                    email: email,
                    password: password,
                }
            )

            console.log('Signup successful:', response.data)
            navigate('/login')



        } catch (error) {
            console.error('Signup failed:', error)

            setError(
                error.response?.data?.detail ||
                'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSignup}>
                    <h1>Create a free account</h1>

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

                        <label>Confirm password*</label>
                        <input
                            type="password"
                            placeholder="e.g Statesman!23"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p>{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Signup