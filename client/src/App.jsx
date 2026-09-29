import React from 'react'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/privateroute/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'
function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='*' element={<p>Path does not exist</p>} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App