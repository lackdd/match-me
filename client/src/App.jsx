import './App.scss'
import {createContext, useContext, useEffect, useState} from 'react';
import NavigatorGuest from './components/nav-bar-guest/nav-bar-guest.jsx';
import NavigatorUser from './components/nav-bar-user/nav-bar-user.jsx';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import {Outlet, useLocation} from 'react-router-dom';
import {AuthContext} from './main.jsx';

// export const AuthContext = createContext();

function App() {
    const location = useLocation();
    const { isUserLoggedIn } = useContext(AuthContext);


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

    /*useEffect(() => {

        fetch('api/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
    }, []);*/

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
