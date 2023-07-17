import React from 'react';
import './App.css';
import RoundView from "./views/RoundView/RoundView";

function HostApp() {

    return (
        <div className="App">
            <RoundView roundNumber={1} />
        </div>
    );
}

export default HostApp;
