import {createContext, StrictMode, useContext, useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss'
import App from './App.jsx';
import HomePage from './components/homepage/homepage.jsx';
import Features from './components/features/features.jsx';
import About from './components/about/about.jsx';
import Support from './components/support/support.jsx';
import NotFound from './components/not-found/not-found.jsx';
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import ForgotPassword from './components/forgot-password/forgot-password.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import ProtectedRoute from './components/utils/ProtectedRoute.jsx';
import Connections from './components/connections/connections.jsx';
import Chats from './components/chats/chats.jsx';
import Recommendations from './components/recommendations/recommendations.jsx';
import Settings from './components/settings/settings.jsx';
import axios from 'axios';

import { AuthProvider } from './components/utils/AuthContext.jsx';


// export const AuthContext = createContext(null);
// export const AuthContext = createContext({ isUserLoggedIn: false, setIsUserLoggedIn: () => {} });

function Main() {
    // const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => sessionStorage.getItem("token") !== null);
    // const [isUserLoggedIn, setIsUserLoggedIn] = useState();
    // const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // useEffect(() => {
    //     const validateToken = async () => {
    //         const token = sessionStorage.getItem("token");
    //         if (token){
    //             try {
    //                 const response = await
    //                     axios.post(`${VITE_BACKEND_URL}/api/validateToken`, {},
    //                         {
    //                             headers: { Authorization: `Bearer ${token}` },
    //                         }
    //                     );
    //                 console.log("Token is valid. Logging in")
    //                 setIsUserLoggedIn(true);
    //             } catch (error) {
    //                 "Failed to validate token. Token either missing or not correct."
    //                 setIsUserLoggedIn(false);
    //             }
    //         }
    //     };
    //
    //     validateToken();
    // }, []);


    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                // <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
                //     <App />
                // </AuthContext.Provider>
                <App />
            ),
            children: [
                { path: "/", element: <HomePage /> },
                { path: "/features", element: <Features /> },
                { path: "/about", element: <About /> },
                { path: "/support", element: <Support /> },
                { path: "/register", element: <Register /> },
                { path: "/login", element: <Login /> },
                { path: "/forgot-password", element: <ForgotPassword /> },
                { path: "/*", element: <NotFound /> },

                {
                    path: "/dashboard",
                    element: <ProtectedRoute />,
                    children: [{ path: "/dashboard", element: <Dashboard /> },],
                },
                {
                    path: "/connections",
                    element: <ProtectedRoute />,
                    children: [{ path: "/connections", element: <Connections /> },],
                },
                {
                    path: "/chats",
                    element: <ProtectedRoute />,
                    children: [{ path: "/chats", element: <Chats /> },],
                },
                {
                    path: "/recommendations",
                    element: <ProtectedRoute />,
                    children: [{ path: "/recommendations", element: <Recommendations /> },],
                },
                {
                    path: "/settings",
                    element: <ProtectedRoute />,
                    children: [{ path: "/settings", element: <Settings /> },],
                },
            ],
        },
    ]);


    return (
        // <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
        //     <RouterProvider router={router} />
        // </AuthContext.Provider>
        //     <RouterProvider router={router} />
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}


// todo disable strict mode in production
createRoot(document.getElementById("root")).render(
    // <StrictMode>
    //     <Main />
    // </StrictMode>
    <Main />
);