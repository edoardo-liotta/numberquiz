import React from 'react';
import './App.css';
import Playground from "./views/Playground/Playground";
import WebSocketClient from "./components/WebSocketClient/WebSocketClient";

function App() {

    return (
        <div className="App">
            <Playground />
        </div>
    );
}

export default App;
