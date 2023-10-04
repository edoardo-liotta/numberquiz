import React from 'react';
import './App.css';
import {HashRouter, Link, Route, Routes} from "react-router-dom";
import PlayerApp from "./PlayerApp";
import HostApp from "./HostApp";
import ScreenApp from "./ScreenApp";
import Configuration from "./components/Configuration/Configuration";
import ScreenRound from "./components/ScreenRound/ScreenRound";
import {RoundStatus} from "./api/service-api";

function App() {

    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/play" element={<PlayerApp />}>Play</Route>
                    <Route path="/host" element={<HostApp />}>Host</Route>
                    <Route path="/screen" element={<ScreenApp />}>Host</Route>
                    <Route path="/countertest"
                           element={<ScreenRound roundNumber={1} roundStatus={RoundStatus.DISPLAYING_ANSWERS}
                                                 question={"Question"} answer={42}
                                                 providedAnswers={[
                                                     {playerName: "No answer", providedAnswer: 0},
                                                     {playerName: "Under", providedAnswer: 10},
                                                     {playerName: "Exact", providedAnswer: 42},
                                                     {playerName: "Over", providedAnswer: 50}
                                                 ]} />}>Counter Test</Route>
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
