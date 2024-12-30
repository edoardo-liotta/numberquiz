import React from 'react';
import './App.css';
import Playground from "./views/Playground/Playground";

const App = ({gameId}: {gameId: string}) => (
  <div className="App">
    <Playground gameId={gameId}/>
  </div>
);

export default App;
