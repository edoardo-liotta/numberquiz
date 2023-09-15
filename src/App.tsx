import React from 'react';
import './App.css';
import {HashRouter, Link, Route, Routes} from "react-router-dom";
import PlayerApp from "./PlayerApp";
import HostApp from "./HostApp";
import ScreenApp from "./ScreenApp";
import Configuration from "./components/Configuration/Configuration";
import CounterComponent from "./components/CounterComponent/CounterComponent";

function App() {

    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/play" element={<PlayerApp />}>Play</Route>
                    <Route path="/host" element={<HostApp />}>Host</Route>
                    <Route path="/screen" element={<ScreenApp />}>Host</Route>
                    <Route path="/countertest" element={<CounterComponent pairs={[{name: "Edoardo", value: 10},{name: "Antonietta", value: 20}]} goalNumber={30} />}>Counter Test</Route>
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
                <li>
                    <Link to="/countertest">Counter test</Link>
                </li>
            </ul>
        </nav>
        <Configuration />
    </>
}

export default App;
