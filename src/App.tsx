import React from 'react';
import './App.css';
import {HashRouter, Link, Route, Routes} from "react-router-dom";
import PlayerApp from "./PlayerApp";
import HostApp from "./HostApp";
import ScreenApp from "./ScreenApp";

function App() {

    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/play" element={<PlayerApp />}>Play</Route>
                    <Route path="/host" element={<HostApp />}>Host</Route>
                    <Route path="/screen" element={<ScreenApp />}>Host</Route>
                </Routes>
            </HashRouter>
        </div>
    );
}

const Home: React.FC = () => {
    return <>
        <nav>
            <ul>
                <li>
                    <Link to="/play">Play</Link>
                </li>
                <li>
                    <Link to="/host">Host</Link>
                </li>
                <li>
                    <Link to="/screen">Screen</Link>
                </li>
            </ul>
        </nav>
    </>
}

export default App;
