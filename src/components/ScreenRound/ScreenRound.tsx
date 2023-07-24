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


    const isDisplayingQuestion = roundStatus !== RoundStatus.IDLE;
    const isDisplayingAnswers = answer !== undefined && [RoundStatus.DISPLAYING_ANSWERS].includes(roundStatus);
    return <>
        <div className={"screen-round-container"}>
            <div className={"screen-round-question-container"}>
                <div className={"screen-round-question"}>{roundStatus === RoundStatus.IDLE && <>Round {roundNumber}</>}
                    {isDisplayingQuestion && question}</div>
                <div
                    className={`screen-round-answer ${!isDisplayingAnswers && "hidden"}`}>{answer}</div>
            </div>

            <ul className={"screen-round-players-container"}>
                {providedAnswers && providedAnswers.map(function (item) {
                    return <li
                        key={item.playerName}
                        className={`screen-round-player ${(isDisplayingAnswers && item.providedAnswer && item.providedAnswer < answer && "under") || ""} ${(isDisplayingAnswers && item.providedAnswer && item.providedAnswer > answer && "over") || ""} ${(isDisplayingAnswers && item.providedAnswer && item.providedAnswer === answer && "exact") || ""}`}>
                        <div
                            className={"screen-round-player-name"}>{item.playerName}{isDisplayingAnswers && item.providedAnswer && item.providedAnswer === answer && " ⭐"}</div>
                        <div
                            className={"screen-round-player-answer"}>{!isDisplayingAnswers && item.providedAnswer && "✅"}{isDisplayingAnswers && item.providedAnswer && item.providedAnswer}</div>
                    </li>
                })}
            </ul>
        </div>
    </>
}

export default ScreenRound;