import './App.css'
import {useEffect, useState} from "react";

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
        <>
            <div>
                <h1>
                    match me
                </h1>
                {users.map(user =>
                    <div key={user.id}>
                        <br/>
                        Email: {user.email}
                    </div>
                )}
            </div>
        </>
    )
}

export default App
