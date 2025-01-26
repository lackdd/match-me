import './App.scss'
import {useEffect, useState} from "react";
import Navigator from './components/nav-bar/nav-bar-main.jsx';
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


    return (
        <div>
            {/* Navigator renders on every route */}
            {/* todo make dynamic so when not logged in show one nav bar and when logged in show the other*/}
            <Navigator />
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
