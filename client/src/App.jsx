import React from "react";
import { Routes, Route } from "react-router-dom";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";

import { AuthProvider } from "./components/context/AuthContext";
import PrivateRoute from "./components/privateroute/PrivateRoute";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./components/pages/Dashboard";
import Auctions from "./components/pages/Auctions";
import AuctionsDetails from "./components/pages/AuctionsDetails";
import MyAuctions from "./components/pages/MyAuctions";
import MyBids from "./components/pages/MyBids";
import CreateAuction from "./components/pages/CreateAuction";

function App() {
    return (
        <AuthProvider>
            <Routes>

                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />

                    <Route path="auctions" element={<Auctions />} />

                    <Route path="auctions/:id" element={<AuctionsDetails />} />

                    <Route path="my-bids" element={<MyBids />} />

                    <Route path='create-auction' element={<CreateAuction />} />

                    <Route path="my-auctions" element={<MyAuctions />} />

                </Route>


                <Route
                    path="*"
                    element={<p>Path does not exist</p>}
                />

            </Routes>
        </AuthProvider>
    );
}

export default App;