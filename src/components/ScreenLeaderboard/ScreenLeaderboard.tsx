import React, {useMemo} from 'react';
import {PlayerScore} from "../../api/service-api";
import './ScreenLeaderboard.css'

interface CounterProps {
    providedAnswers: PlayerScore[];
}

const ScreenLeaderboard: React.FC<CounterProps> = ({providedAnswers}) => {
    const topScore = useMemo(() => {
        return providedAnswers.at(0)?.totalScore || 0
    }, [providedAnswers])

    return <>
        <div className={"leaderboard-container"}>
            <div className={"leaderboard-question-container"}>
                <div className={"leaderboard-question"}>Classifica</div>
                <div className={'leaderboard-answer'}>&nbsp;</div>
            </div>

            <table className={"leaderboard-players-container"}>
                <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Punti</th>
                    <th>Esatte</th>
                    <th>Oltre</th>
                </tr>
                </thead>
                <tbody>

                {providedAnswers && providedAnswers.map(function (item) {
                    const overlayStyle: React.CSSProperties = {
                        position: 'absolute',
                        width: `calc(${Math.min((item.totalScore * 100.0 / Math.max(topScore, 1)), 100)}% - 8px)`,
                        height: 'calc(100% - 8px)',
                        backgroundColor: 'blue',
                        opacity: 0.25, // Adjust the opacity as needed
                        translate: "0 -50%"
                    };

                    const goldOverlayStyle: React.CSSProperties = {
                        float: 'right',
                        width: `calc(${Math.min((item.goldPoints * 100.0 / Math.max(item.totalScore, 1)), 100)}%)`,
                        height: 'calc(100%)',
                        backgroundColor: 'darkgoldenrod',
                    };

                    return <tr
                        key={item.playerName}
                        style={{position: 'relative'}}
                        className={'leaderboard-player'}>
                        <td style={{display: "inline-flex"}}><div style={overlayStyle}><div style={goldOverlayStyle} /></div></td>
                        <td
                            className={"leaderboard-player-name"}>{item.playerName}</td>
                        <td
                            className={"leaderboard-player-answer"}>{item.totalScore}</td>
                        <td
                            className={"leaderboard-player-answer exact"}>{item.exactAnswers}</td>
                        <td
                            className={"leaderboard-player-answer over"}>{item.overAnswers}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </>
};

export default ScreenLeaderboard;
