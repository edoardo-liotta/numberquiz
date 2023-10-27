import React, {useCallback, useEffect, useRef} from "react";
import * as serviceApi from "../../api/service-api";
import {
    advanceToNextRound,
    awardPoints,
    getRound,
    PlayerAnswer,
    RoundResponse,
    RoundStatus,
    showRoundResults,
    startRound,
    stopRound
} from "../../api/service-api";
import HostRound from "../../components/HostRound/HostRound";
import Idle from "../../components/Idle/Idle";
import HostActions from "./HostActions";

interface HostPlaygroundProps {
    initialQuestion?: string;
    isDebug?: boolean;
}

export interface OnConfirmAnswerProps {
    value: number;
}

const HostPlayground: React.FC<HostPlaygroundProps> = (props: HostPlaygroundProps) => {
    const [error, setError] = React.useState<Error | undefined>();
    const [roundNumber] = React.useState<number>(1);
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>()
    const [question, setQuestion] = React.useState<string | undefined>(props.initialQuestion)
    const [answer, setAnswer] = React.useState<number | undefined>()
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[]>([])
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);

    const setRoundState = useCallback((roundResponse: RoundResponse) => {
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setAnswer(roundResponse.answer)
        setProvidedAnswers(roundResponse.providedAnswers)
        if ([RoundStatus.STARTED, RoundStatus.STOPPING].includes(roundResponse.roundStatus)) {
            if (fetchInterval.current === null) {
                fetchInterval.current = setInterval(() => {
                    getRound().then(setRoundState).catch(e => {
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
    }, [fetchInterval])

    const triggerStartRound = () => {
        setError(undefined)
        startRound().then(setRoundState).catch(e => {
            setError(e)
        })
    }

    const triggerStopRound = () => {
        setError(undefined)
        stopRound().then(setRoundState).catch(e => {
            setError(e)
        })
    }

    const triggerDisplayAnswers = () => {
        setError(undefined)
        showRoundResults().then(setRoundState).catch(e => {
            setError(e)
        })
    }

    const triggerAwardPoints = () => {
        setError(undefined)
        awardPoints().then(setRoundState).catch(e => {
            setError(e)
        })
    }

    const triggerAdvanceToNextRound = useCallback(() => {
        advanceToNextRound().then(setRoundState).catch(e => {
            setError(e)
        })
    }, [])

    const triggerShowLeaderboard = useCallback(() => {
        serviceApi.triggerShowLeaderboard().then(() => {})
    }, [])

    const triggerShowRound = useCallback(() => {
        serviceApi.triggerShowRound().then(() => {})
    }, [])

    useEffect(() => {
        setError(undefined)
        getRound().then(setRoundState).catch(e => {
            setError(e)
        })
        return () => {
            if (fetchInterval.current !== null) {
                clearInterval(fetchInterval.current);
                fetchInterval.current = null;
            }
        }
    }, [roundNumber, setRoundState])

    return <>
        {!roundStatus &&
            <Idle />
        }
        {roundStatus && question && answer &&
            <HostRound roundStatus={roundStatus} question={question} answer={answer} providedAnswers={providedAnswers}
                       onTriggerStartRound={triggerStartRound} onTriggerStopRound={triggerStopRound}
                       onTriggerDisplayAnswers={triggerDisplayAnswers} onTriggerAwardPoints={triggerAwardPoints}
                       onTriggerAdvanceToNextRound={triggerAdvanceToNextRound} />
        }
        {error &&
            <div className="error">Error: {error.message}</div>
        }
        <HostActions onShowLeaderboard={triggerShowLeaderboard} onShowRound={triggerShowRound} />
    </>
}

export default HostPlayground;