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
                    <Route path="/play" element={<PlayerApp />} />
                    <Route path="/host" element={<HostApp />} />
                    <Route path="/screen" element={<ScreenApp />} />
                    <Route path="/countertest"
                           element={<ScreenRound roundNumber={1} roundStatus={RoundStatus.DISPLAYING_ANSWERS}
                                                 question={"Expect 42"} answer={42}
                                                 providedAnswers={[
                                                     {playerName: "No answer", providedAnswer: 0},
                                                     {playerName: "Under", providedAnswer: 30},
                                                     {playerName: "Exact", providedAnswer: 42},
                                                     {playerName: "Over", providedAnswer: 50}
                                                 ]} />} />
                    <Route path="/countertest-onlyunder"
                           element={<ScreenRound roundNumber={1} roundStatus={RoundStatus.DISPLAYING_ANSWERS}
                                                 question={"Expect 42"} answer={42}
                                                 providedAnswers={[
                                                     {playerName: "No answer", providedAnswer: 0},
                                                     {playerName: "Under1", providedAnswer: 10},
                                                     {playerName: "Under2", providedAnswer: 15},
                                                     {playerName: "Under3", providedAnswer: 30}
                                                 ]} />} />
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
                    <Link to="/countertest">Counter test: Under, exact, over</Link>
                </li>
                <li>
                    <Link to="/countertest-onlyunder">Counter test: only under</Link>
                </li>
            </ul>
        </nav>
        <Configuration />
    </>
}

export default App;
