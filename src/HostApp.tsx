import React from 'react';
import './App.css';
import HostPlayground from "./views/HostPlayground/HostPlayground";

const HostApp = ({gameId}: {gameId: string}) => (
  <div className="App">
    <HostPlayground gameId={gameId}/>
  </div>
);

export default HostApp;
