import './App.scss'
import {createContext, useContext, useEffect, useState} from 'react';
import NavigatorGuest from './components/nav-bar-guest/nav-bar-guest.jsx';
import NavigatorUser from './components/nav-bar-user/nav-bar-user.jsx';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import {Outlet, useLocation} from 'react-router-dom';
import axios from "axios";
import {AuthContext} from './main.jsx';

// export const AuthContext = createContext();

function App() {
    const location = useLocation();
    // todo React Router caught the following error during render TypeError: Cannot destructure property 'isUserLoggedIn' of 'useContext(...)' as it is undefined.
    //     at App (App.jsx:16:13)
    const { isUserLoggedIn, setIsUserLoggedIn } = useContext(AuthContext);
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // wake up backend when frontend is rendered
    useEffect(() => {
        const wakeUpBackend = async () => {
            try {
                const response = await axios.post(`${VITE_BACKEND_URL}/api/hello-backend`, {
                    message: "Hello from backend"
                });
                console.log(response.data);
            } catch (error) {
                console.error("Failed to wake up backend: " + error.message);
            }
        }
        wakeUpBackend();
    });


    useEffect(() => {
        const validateToken = async () => {
            const token = sessionStorage.getItem("token");
            if (token){
                try {
                    const response = await
                        axios.post(`${VITE_BACKEND_URL}/api/validateToken`, {},
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
    // useEffect(() => {
    //     const token = sessionStorage.getItem("token");
    //
    //     if (token) {
    //         setIsUserLoggedIn(true);
    //     }
    // }, [sessionStorage.getItem("token")]);

    // const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    //     return sessionStorage.getItem("token") ? true : false;
    // });


    // Define routes where the guest NavBar should be shown
    const guestRoutes = ["/", "/login", "/forgot-password", "/features", "/about", "/support", "/forgot-password"];
    const userRoutes = ["/dashboard", "/chats", "/recommendations", "/connections", "/settings"];

    // Check if the current route is in guestRoutes
    const isGuestRoute = guestRoutes.includes(location.pathname);
    const isUserRoute = userRoutes.includes(location.pathname);
    const isRegister = location.pathname === "/register";

    return (
        // <AuthContext.Provider value={{isUserLoggedIn, setIsUserLoggedIn}}>
            <div>
                {/*{!isRegister ?*/}
                {/*    (isUserLoggedIn === false ? <NavigatorGuest /> :*/}
                {/*        isUserLoggedIn === true ? <NavigatorUser /> : null) : null}*/}
                {!isRegister ? (
                    isUserLoggedIn ? <NavigatorUser /> : <NavigatorGuest />
                ) : null}

                {/*{!isUserLoggedIn && !isRegister && <NavigatorGuest/>}*/}
                {/*{isUserLoggedIn && !isRegister &&  <NavigatorUser/>}*/}

                {/*{isGuestRoute && !isRegister && <NavigatorGuest/>}*/}
                {/*{isUserRoute && isUserLoggedIn && !isRegister &&  <NavigatorUser/>}*/}
                <Outlet/>
            </div>



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
