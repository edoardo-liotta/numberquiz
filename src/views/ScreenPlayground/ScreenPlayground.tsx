import React, {useCallback, useEffect, useMemo, useRef} from "react";
import Idle from "../../components/Idle/Idle";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";
import {getRound, PlayerAnswer, RoundResponse, RoundStatus} from "../../api/service-api";
import ScreenRound from "../../components/ScreenRound/ScreenRound";
import QRCodeGenerator from "../../components/QRCodeGenerator/QRCodeGenerator";
import {getClientUrl, getServiceUrl} from "../../api/config-api";

interface ScreenPlaygroundProps {
    isDebug?: boolean;
}

const ScreenPlayground: React.FC<ScreenPlaygroundProps> = (props: ScreenPlaygroundProps) => {
    const [error, setError] = React.useState<Error | undefined>();
    const [latestMessage, setLatestMessage] = React.useState<string>()
    const [roundNumber, setRoundNumber] = React.useState<number>(1);
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>()
    const [question, setQuestion] = React.useState<string | undefined>()
    const [answer, setAnswer] = React.useState<number | undefined>()
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[]>([])
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);

    const joinLink = useMemo(() => {
        return getClientUrl() + "/#/welcome?serviceUrl=" + encodeURIComponent(getServiceUrl())
    }, [])

    const setRoundState = useCallback((roundResponse: RoundResponse) => {
        setRoundNumber(roundResponse.roundNumber)
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setAnswer(roundResponse.answer)
        setProvidedAnswers(roundResponse.providedAnswers)
        console.log("Round status: " + roundResponse.roundStatus)
        if ([RoundStatus.STARTED, RoundStatus.STOPPING].includes(roundResponse.roundStatus)) {
            console.log("fetch interval: " + fetchInterval.current)
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

    const handleSocketConnected = useCallback((socket: WebSocket) => {
        setError(undefined)
        socket.send("register-screen")
    }, [])

    const handleMessageReceived = useCallback((message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
        if (message.startsWith("update-round")) {
            getRound().then(setRoundState).catch(e => {
                setError(e)
            })
        }
    }, [setRoundState])

    useEffect(() => {
        setError(undefined)
        getRound().then(setRoundState).catch(e => {
            setError(e)
        })
    }, [roundNumber, setRoundState])

    return <>
        <div className={"screen-playground-container"}>
            {!roundStatus && <>
              <Idle />
            </>}
            {roundStatus && question && <>
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
        {joinLink}
        <QRCodeGenerator url={joinLink} />
        <WebSocketClient onSocketConnected={handleSocketConnected} onMessageReceived={handleMessageReceived}
                         isDebug={props.isDebug}
                         latestMessage={latestMessage} />
    </>
}

ScreenPlayground.defaultProps = {
    isDebug: true
}
export default ScreenPlayground;