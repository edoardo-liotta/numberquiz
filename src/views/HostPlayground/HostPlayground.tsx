import React, {useEffect, useRef} from "react";
import {endRound, getRound, PlayerAnswer, RoundResponse, RoundStatus, startRound} from "../../api/service-api";
import Round from "../../components/Round/Round";
import Idle from "../../components/Idle/Idle";

interface HostPlaygroundProps {
    initialQuestion?: string;
    isDebug?: boolean;
}

export interface OnConfirmAnswerProps {
    value: number;
}

const HostPlayground: React.FC<HostPlaygroundProps> = (props: HostPlaygroundProps) => {
    const [error, setError] = React.useState<string | undefined>();
    const [roundNumber, setRoundNumber] = React.useState<number>(1);
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>()
    const [question, setQuestion] = React.useState<string | undefined>(props.initialQuestion)
    const [answer, setAnswer] = React.useState<number | undefined>()
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[]>([])

    const setRoundState = (roundResponse: RoundResponse) => {
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setAnswer(roundResponse.answer)
        setProvidedAnswers(roundResponse.providedAnswers)
        if ([RoundStatus.STARTED, RoundStatus.STOPPING].includes(roundResponse.roundStatus)) {
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

    return <>
        {!roundStatus &&
            <Idle />
        }
        {roundStatus && question && answer &&
            <Round roundStatus={roundStatus} question={question} answer={answer} providedAnswers={providedAnswers}
                   onTriggerStartRound={triggerStartRound} onTriggerEndRound={triggerEndRound} />
        }
        {error &&
            <div className="error">Error: {error}</div>
        }
    </>
}

export default HostPlayground;