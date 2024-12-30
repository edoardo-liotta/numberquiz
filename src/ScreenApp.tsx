import React from 'react';
import './App.css';
import ScreenPlayground from "./views/ScreenPlayground/ScreenPlayground";

const ScreenApp = ({gameId}: {gameId: string}) => (
  <div className="App">
    <ScreenPlayground gameId={gameId}/>
  </div>
);

export default ScreenApp;
