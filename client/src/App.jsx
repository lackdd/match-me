import './App.css'
import {useEffect, useState} from "react";

function App() {
    const [clients, setClients] = useState([]);

    useEffect(() => {

        fetch('api/clients')
            .then(response => response.json())
            .then(data => {
                setClients(data);
            })
    }, []);


    return (
        <>
            <div>
                <h1>
                    match me
                </h1>
                {clients.map(client =>
                    <div key={client.id}>
                        <br/>
                        Name: {client.name} <br/>
                        Email: {client.email}
                    </div>
                )}
            </div>
        </>
    )
}

export default App
