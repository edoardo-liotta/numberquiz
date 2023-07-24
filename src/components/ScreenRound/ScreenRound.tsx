import React from "react";
import {PlayerAnswer, RoundStatus} from "../../api/service-api";
import './ScreenRound.css'


interface ScreenRoundProps {
    roundNumber: number;
    roundStatus: RoundStatus;
    question: string;
    answer?: number;
    providedAnswers: PlayerAnswer[];
}

const ScreenRound: React.FC<ScreenRoundProps> = ({
                                                     roundNumber,
                                                     roundStatus,
                                                     question,
                                                     answer,
                                                     providedAnswers,
                                                 }: ScreenRoundProps) => {
    return <>
        <div className={"screen-round-container"}>
            <div className={"screen-round-question-container"}>
                <div className={"screen-round-question"}>{roundStatus === RoundStatus.IDLE && <>Round {roundNumber}</>}
                    {roundStatus !== RoundStatus.IDLE && question}</div>
                {[RoundStatus.DISPLAYING_ANSWERS].includes(roundStatus) &&
                    <div className={"screen-round-answer"}>{answer}</div>}
            </div>

            <ul className={"screen-round-players-container"}>
                {providedAnswers && providedAnswers.map(function (item) {
                    return <li
                        key={item.playerName}
                        className={`screen-round-player ${answer && item.providedAnswer && item.providedAnswer < answer && "under"} ${answer && item.providedAnswer && item.providedAnswer > answer && "over"}`}>
                        <div
                            className={"screen-round-player-name"}>{item.playerName}{answer && item.providedAnswer && item.providedAnswer === answer && " ⭐"}</div>
                        <div
                            className={"screen-round-player-answer"}>{!answer && item.providedAnswer && "✅"}{answer && item.providedAnswer && item.providedAnswer}</div>
                    </li>
                })}
            </ul>
        </div>
    </>
}

export default ScreenRound;