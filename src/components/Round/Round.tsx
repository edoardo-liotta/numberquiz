import React from "react";
import {PlayerAnswer, RoundStatus} from "../../api/service-api";
import './Round.css'


interface RoundProps {
    roundStatus: RoundStatus;
    question: string;
    answer: number;
    providedAnswers: PlayerAnswer[];
    onTriggerStartRound?: () => void;
    onTriggerEndRound?: () => void;
}

const Round: React.FC<RoundProps> = ({
                                         roundStatus,
                                         question,
                                         answer,
                                         providedAnswers,
                                         onTriggerStartRound,
                                         onTriggerEndRound
                                     }: RoundProps) => {
    const [answerVisible, setAnswerVisible] = React.useState<boolean>(false)

    const toggleAnswerVisible = () => {
        setAnswerVisible(!answerVisible)
    }

    return <div className={"host-round-container"}>
        <div className={"host-round-question-container"}>
            <div className={"host-round-question"}>{question}</div>
            <div className={"host-round-answer"}
                 onClick={toggleAnswerVisible}>{answerVisible ? answer : "???"}</div>
        </div>
        <div className={"host-round-status-container"}>
            {roundStatus === RoundStatus.IDLE &&
                <div>
                  <button id={"host-round-start-button"} className={"host-round-status-button"}
                          onClick={onTriggerStartRound}>Inizia il round
                  </button>
                </div>
            }
            {roundStatus === RoundStatus.STARTED &&
                <div>
                  <button id={"host-round-end-button"} className={"host-round-status-button"}
                          onClick={onTriggerEndRound}>Termina il round
                  </button>
                </div>
            }
            {roundStatus === RoundStatus.STOPPED &&
                <div>
                  <button id={"host-round-show-results-button"} className={"host-round-status-button"}
                  >Mostra i risultati
                  </button>
                </div>
            }
        </div>
        <ul className={"host-round-players-container"}>
            {providedAnswers && providedAnswers.map(function (item) {
                return <li className={"host-round-player"} key={item.playerName}>
                    <div className={"host-round-player-name"}>{item.playerName}</div>
                    <div className={"host-round-player-answer"}>{item.providedAnswer || "-"}</div>
                </li>
            })}
        </ul>
    </div>
}

export default Round;