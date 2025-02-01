import {createContext, StrictMode, useContext, useState} from 'react';
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
import ProtectedRoute from './ProtectedRoute.jsx';



// ✅ Move AuthContext creation to main.jsx
export const AuthContext = createContext();

function Main() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => sessionStorage.getItem("token") !== null);


    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,  // Still wrapped in AuthContext
            // problems rendering nav bar if errorElement is used
            // errorElement: (
            //     <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
            //         <NotFound />
            //     </AuthContext.Provider>
            // ), // Now NotFound also has access to AuthContext
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
                    children: [{ path: "/dashboard", element: <Dashboard /> }],
                },
            ],
        },
    ]);


    return (
        <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
            <RouterProvider router={router} />
        </AuthContext.Provider>
    );
}



createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Main />
    </StrictMode>
);