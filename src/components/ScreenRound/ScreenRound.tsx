import React from "react";
import {PlayerAnswer, RoundStatus} from "../../api/service-api";
import './ScreenRound.css'


interface ScreenRoundProps {
    roundNumber: number;
    roundStatus: RoundStatus;
    question: string;
    providedAnswers: PlayerAnswer[];
}

const ScreenRound: React.FC<ScreenRoundProps> = ({roundNumber,
                                                     roundStatus,
                                                     question,
                                                     providedAnswers,
                                                 }: ScreenRoundProps) => {
    return <>
        <div className={"screen-round-container"}>
            <div className={"screen-round-question-container"}>
                <div className={"screen-round-question"}>{roundStatus === RoundStatus.IDLE && <>Round {roundNumber}</>}
                    {roundStatus !== RoundStatus.IDLE && question}</div>
            </div>

            <ul className={"screen-round-players-container"}>
                {providedAnswers && providedAnswers.map(function (item) {
                    return <li className={"screen-round-player"} key={item.playerName}>
                        <div className={"screen-round-player-name"}>{item.playerName}</div>
                        <div className={"screen-round-player-answer"}>{item.providedAnswer && "✅"}</div>
                    </li>
                })}
            </ul>
        </div>
    </>
}

export default ScreenRound;