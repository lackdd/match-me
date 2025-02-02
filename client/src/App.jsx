import './App.scss'
import {createContext, useEffect, useState} from "react";
import NavigatorGuest from './components/nav-bar-guest/nav-bar-guest.jsx';
import NavigatorUser from './components/nav-bar-user/nav-bar-user.jsx';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import {Outlet, useLocation} from 'react-router-dom';
import axios from "axios";

export const AuthContext = createContext();

function App() {
    const location = useLocation();

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = sessionStorage.getItem("token");
            if (token){
                try {
                    const response = await
                        axios.post('http://localhost:8080/validateToken', {},
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                    console.log("Token is valid. Logging in")
                    setIsUserLoggedIn(true);
                } catch (error) {
                    "Failed to validate token. Token either missing or not correct."
                    setIsUserLoggedIn(false);
                }
            }
        };

        validateToken();
    }, []);

    /*useEffect(() => {

        fetch('api/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
    }, []);*/

    // todo show nav bar based in authentication state (y/n) instead of just route
    // Define routes where the guest NavBar should be shown
    const guestRoutes = ["/", "/login", "/forgot-password", "/features", "/about", "/support", "/forgot-password"];
    const userRoutes = ["/dashboard", "/chats", "/recommendations", "/connections", "/support", "/settings"];

    // Check if the current route is in guestRoutes
    const isGuestRoute = guestRoutes.includes(location.pathname);
    const isUserRoute = userRoutes.includes(location.pathname);
    const hideNavBar = location.pathname === "/register";


    return (
        <AuthContext.Provider value={{isUserLoggedIn, setIsUserLoggedIn}}>
            <div>
                {/* Navigator renders on every route */}
                {isGuestRoute && !hideNavBar && <NavigatorGuest/>}
                {isUserRoute && !hideNavBar && isUserLoggedIn && <NavigatorUser/>}
                {/* This is where the current route's component will be displayed */}
                <Outlet/>
            </div>
        </AuthContext.Provider>
    );
            {/*<div>*/}
            {/*    {users.map(user =>*/}
            {/*        <div key={user.id}>*/}
            {/*            <br/>*/}
            {/*            Name: {user.username}*/}
            {/*            <br/>*/}
            {/*            Email: {user.email}*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}

}

export default App
