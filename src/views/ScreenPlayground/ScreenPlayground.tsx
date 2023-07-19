import React, {useEffect, useRef} from "react";
import Idle from "../../components/Idle/Idle";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";
import {getRound, PlayerAnswer, RoundResponse, RoundStatus} from "../../api/service-api";
import ScreenRound from "../../components/ScreenRound/ScreenRound";

interface ScreenPlaygroundProps {
    isDebug?: boolean;
}
const ScreenPlayground: React.FC<ScreenPlaygroundProps> = (props: ScreenPlaygroundProps) => {
    const [error, setError] = React.useState<string | undefined>();
    const [latestMessage, setLatestMessage] = React.useState<string>()
    const [roundNumber, setRoundNumber] = React.useState<number>(1);
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>()
    const [question, setQuestion] = React.useState<string | undefined>()
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[]>([])
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);

    const setRoundState = (roundResponse: RoundResponse) => {
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setProvidedAnswers(roundResponse.providedAnswers)
        console.log("Round status: " + roundResponse.roundStatus)
        if ([RoundStatus.STARTED, RoundStatus.STOPPING].includes(roundResponse.roundStatus)) {
            console.log("fetch interval: " + fetchInterval.current)
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

    const handleMessageReceived = (message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
        if (message.startsWith("update-round")) {
            getRound(roundNumber).then(setRoundState).catch(e => {
                setError(e)
            })
        }
    }

    useEffect(() => {
        setError(undefined)
        getRound(roundNumber).then(setRoundState).catch(e => {
            setError(e)
        })
    }, [roundNumber])

    return <>
        <div className={"screen-playground-container"}>
            {!roundStatus && <>
              <Idle />
            </>}
            {roundStatus && question && <>
              <ScreenRound roundNumber={roundNumber} roundStatus={roundStatus} question={question} providedAnswers={providedAnswers} />
            </>}
            {error && <>
              <div className={"screen-playground-error"}>
                Qualcosa è andato storto. Riprova.<br />
                  {error}
              </div>
            </>}
        </div>
        <WebSocketClient onMessageReceived={handleMessageReceived} isDebug={props.isDebug}
                         latestMessage={latestMessage} />
    </>
}

ScreenPlayground.defaultProps = {
    isDebug: true
}
export default ScreenPlayground;