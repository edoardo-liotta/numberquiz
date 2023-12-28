import Idle from "../Idle/Idle";
import ScreenLeaderboard from "../ScreenLeaderboard/ScreenLeaderboard";
import ScreenRound from "../ScreenRound/ScreenRound";
import React from "react";
import {PlayerAnswer, RoundStatus} from "../../api/service-api";

interface ScreenCanvasProps {
    roundNumber?: number;
    roundStatus?: RoundStatus;
    question?: string;
    answer?: number;
    providedAnswers: PlayerAnswer[];
    leaderboard?: any[];
    error?: Error;
}

const ScreenCanvas: React.FC<ScreenCanvasProps> = ({
                                                       error,
                                                       roundNumber,
                                                       roundStatus,
                                                       providedAnswers,
                                                       answer,
                                                       question,
                                                       leaderboard
                                                   }: ScreenCanvasProps) => {
    return <>
        <div className={"screen-playground-container"}>
            {!roundNumber && !leaderboard && <>
              <Idle />
            </>}
            {!roundNumber && leaderboard && <>
              <ScreenLeaderboard playerScores={leaderboard} />
            </>}
            {roundStatus && roundNumber && question && <>
              <ScreenRound roundNumber={roundNumber} roundStatus={roundStatus} question={question} answer={answer}
                           providedAnswers={providedAnswers} />
            </>}
            {error && <>
              <div className={"screen-playground-error"}>
                Qualcosa è andato storto. Riprova.<br />
                  {error.message}
              </div>
            </>}
        </div>
    </>
}

export default ScreenCanvas