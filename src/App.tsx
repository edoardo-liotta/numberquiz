import React from 'react';
import './App.css';
import {HashRouter, Link, Route, Routes, useLocation} from "react-router-dom";
import PlayerApp from "./PlayerApp";
import HostApp from "./HostApp";
import ScreenApp from "./ScreenApp";
import Configuration from "./components/Configuration/Configuration";
import ScreenRound from "./components/ScreenRound/ScreenRound";
import {RoundStatus} from "./api/service-api";
import WelcomeApp from "./WelcomeApp";
import ScreenLeaderboard from "./components/ScreenLeaderboard/ScreenLeaderboard";

function App() {

  const query = new URLSearchParams(useLocation().search);
  const gameId = query.get('gameId') || "1";

    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/play" element={<PlayerApp />} />
                    <Route path="/host" element={<HostApp gameId={gameId} />} />
                    <Route path="/screen" element={<ScreenApp gameId={gameId} />} />
                    <Route path="/welcome" element={<WelcomeApp />} />
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
                    <Route path="/leaderboardtest"
                           element={<ScreenLeaderboard playerScores={[
                               {playerName: "Leader", standardPoints: 30, goldPoints: 0, exactAnswers: 0, overAnswers: 0, totalScore: 30},
                               {playerName: "Runner-up", standardPoints: 15, goldPoints: 5, exactAnswers: 1, overAnswers: 0, totalScore: 20},
                               {playerName: "Third", standardPoints: 15, goldPoints: 5, exactAnswers: 1, overAnswers: 1, totalScore: 20},
                               {playerName: "Fourth", standardPoints: 20, goldPoints: 0, exactAnswers: 0, overAnswers: 0, totalScore: 20},
                               {playerName: "Last", standardPoints: 5, goldPoints: 5, exactAnswers: 1, overAnswers: 0, totalScore: 10},
                           ]}/>} />
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
                    <Link to="/welcome">Welcome</Link>
                </li>
                <li>
                    <Link to="/countertest">Counter test: Under, exact, over</Link>
                </li>
                <li>
                    <Link to="/countertest-onlyunder">Counter test: only under</Link>
                </li>
                <li>
                    <Link to="/leaderboardtest">Leaderboard test</Link>
                </li>
            </ul>
        </nav>
        <Configuration />
    </>
}

export default App;
