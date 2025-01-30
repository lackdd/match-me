import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss'
import App from './App.jsx'
import HomePage from './components/homepage/homepage.jsx';
import Features from './components/features/features.jsx';
import About from './components/about/about.jsx';
import Support from './components/support/support.jsx';
import NotFound from './components/not-found/not-found.jsx';
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import ForgotPassword from './components/forgot-password/forgot-password.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {
                path: '/',
                element: <HomePage />, // This will render inside the <Outlet> in App
            },
            {
                path: '/features',
                element: <Features />,
            },
            {
                path: '/about',
                element: <About />,
            },
            {
                path: '/support',
                element: <Support />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
        ]
    },
    // {
    //     path: '/features',
    //     element: <Features/>,
    // },
    // {
    //     path: '/about',
    //     element: <About/>,
    // },
    // {
    //     path: '/support',
    //     element: <Support/>,
    // },
    // {
    //     path: '/get-started',
    //     element: <SignUp/>,
    // },
    // {
    //     path: '/login',
    //     element: <Login/>,
    // }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/*<Navigator/>*/}
    <RouterProvider router={router} />
      {/*<App />*/}
  </StrictMode>,
)
