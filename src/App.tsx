import React from 'react';
import './App.css';
import Playground from "./views/Playground/Playground";
import WebSocketClient from "./components/WebSocketClient/WebSocketClient";

function App() {
    const [latestMessage, setLatestMessage] = React.useState<string>()

    const handleMessageReceived = (message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
    }

    return (
        <div className="App">
            <p>Latest message: {latestMessage}</p>
            <WebSocketClient onMessageReceived={handleMessageReceived} />
            <Playground />
        </div>
    );
}

export default App;
