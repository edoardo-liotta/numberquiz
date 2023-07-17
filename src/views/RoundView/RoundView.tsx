import React, {useEffect, useRef} from "react";
import {endRound, getRound, PlayerAnswer, RoundResponse, RoundStatus, startRound} from "../../api/service-api";
import Idle from "../../components/Idle/Idle";
import './RoundView.css'


interface RoundViewProps {
    roundNumber: number;
}

const RoundView: React.FC<RoundViewProps> = ({roundNumber}: RoundViewProps) => {
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>(undefined)
    const [question, setQuestion] = React.useState<string | undefined>(undefined)
    const [answer, setAnswer] = React.useState<number | undefined>(undefined)
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[] | undefined>(undefined)
    const [answerVisible, setAnswerVisible] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | undefined>(undefined)
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);

    const setRoundState = (roundResponse: RoundResponse) => {
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setAnswer(roundResponse.answer)
        setProvidedAnswers(roundResponse.providedAnswers)
        if (roundResponse.roundStatus === RoundStatus.IN_PROGRESS) {
            if (fetchInterval.current === null) {
                fetchInterval.current = setInterval(() => {
                    getRound(roundNumber).then(setRoundState).catch(e => {
                        setError(e)
                    })
                }, 1000)
            }
        } else {
            if (fetchInterval.current !== null) {
                clearInterval(fetchInterval.current)
                fetchInterval.current = null
            }
        }
    }

    useEffect(() => {
        setError(undefined)
        getRound(roundNumber).then(setRoundState).catch(e => {
            setError(e)
        })
        return () => {
            if (fetchInterval.current !== null) {
                clearInterval(fetchInterval.current);
                fetchInterval.current = null;
            }
        }
    }, [roundNumber])

    const toggleAnswerVisible = () => {
        setAnswerVisible(!answerVisible)
    }

    const triggerStartRound = () => {
        setError(undefined)
        startRound(roundNumber).then(setRoundState).catch(e => {
            setError(e)
        })
    }

    const triggerEndRound = () => {
        setError(undefined)
        endRound(roundNumber).then(setRoundState).catch(e => {
            setError(e)
        })
    }

    return <div className={"playground-container"}>
        {!roundStatus &&
            <Idle />
        }
        {question && <>
          <div className={"playground-question-container"}>
            <div className={"playground-question"}>{question}</div>
            <div className={"playground-answer"}
                 onClick={toggleAnswerVisible}>{answerVisible ? answer : "???"}</div>
          </div>
          <div className={"playground-status-container"}>
              {roundStatus === RoundStatus.IDLE &&
                  <div>
                    <button id={"playground-start-button"} className={"playground-status-button"}
                            onClick={triggerStartRound}>Inizia il round
                    </button>
                  </div>
              }
              {roundStatus === RoundStatus.IN_PROGRESS &&
                  <div>
                    <button id={"playground-end-button"} className={"playground-status-button"}
                            onClick={triggerEndRound}>Termina il round
                    </button>
                  </div>
              }
              {roundStatus === RoundStatus.FINISHED &&
                  <div>
                    <button id={"playground-show-results-button"} className={"playground-status-button"}
                            >Mostra i risultati
                    </button>
                  </div>
              }
          </div>
          <div className={"playground-players-container"}>
              {providedAnswers && providedAnswers.map(function (item) {
                  return <div className={"playground-player"}>
                      <div className={"playground-player-name"}>{item.playerName}</div>
                      <div className={"playground-player-answer"}>{item.providedAnswer || "-"}</div>
                  </div>
              })}
          </div>
        </>
        }
        {error && <div className={"error"}>Error: {error}</div>}
    </div>
}

export default RoundView;