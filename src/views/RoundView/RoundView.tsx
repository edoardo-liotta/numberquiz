import React, {useEffect} from "react";
import {getRound, PlayerAnswer, RoundStatus} from "../../api/service-api";
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

    useEffect(() => {
        setError(undefined)
        getRound(roundNumber).then(roundResponse => {
            setRoundStatus(roundResponse.roundStatus)
            setQuestion(roundResponse.question)
            setAnswer(roundResponse.answer)
            setProvidedAnswers(roundResponse.providedAnswers)
        }).catch(e => {
            setError(e)
        })
    }, [roundNumber])

    const toggleAnswerVisible = () => {
        setAnswerVisible(!answerVisible)
    }

    return <div className={"playground-container"}>
        {!roundStatus &&
            <Idle />
        }
        {question &&
            <div className={"playground-question-container"}>
              <div className={"playground-question"}>{question}</div>
              <div className={"playground-answer"}
                   onClick={toggleAnswerVisible}>{answerVisible ? answer : "???"}</div>
            </div>
        }
        <div className={"playground-status-container"}>
            {roundStatus === RoundStatus.IDLE &&
                <div>
                  <button id={"playground-start-button"}>Inizia il round</button>
                </div>
            }
        </div>
        {error && <div className={"error"}>Error: {error}</div>}
    </div>
}

export default RoundView;