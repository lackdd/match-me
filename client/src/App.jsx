import './App.scss'
import {useEffect, useState} from "react";
import NavigatorGuest from './components/nav-bar-guest/nav-bar-guest.jsx';
import NavigatorUser from './components/nav-bar-user/nav-bar-user.jsx';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import {Outlet} from 'react-router-dom';

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetch('api/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
    }, []);

    // todo show nav bar based in authentication state (y/n) instead of just route
    // Define routes where the guest NavBar should be shown
    const guestRoutes = ["/", "/login", "/forgot-password", "/features", "/about", "/support", "/forgot-password"];
    const userRoutes = ["/dashboard", "/chats", "/recommendations", "/connections", "/support", "/settings"];

    // Check if the current route is in guestRoutes
    const isGuestRoute = guestRoutes.includes(location.pathname);
    const isUserRoute = userRoutes.includes(location.pathname);


    return (
        <div>
            {/* Navigator renders on every route */}
            {isGuestRoute && <NavigatorGuest />}
            {isUserRoute && <NavigatorUser />}
            {/* This is where the current route's component will be displayed */}
            <Outlet />
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
