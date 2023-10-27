import React, {useCallback, useEffect, useMemo, useRef} from "react";
import Idle from "../../components/Idle/Idle";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";
import {
    getLeaderboard,
    getRound,
    LeaderboardResponse,
    PlayerAnswer,
    PlayerScore,
    RoundResponse,
    RoundStatus
} from "../../api/service-api";
import ScreenRound from "../../components/ScreenRound/ScreenRound";
import QRCodeGenerator from "../../components/QRCodeGenerator/QRCodeGenerator";
import {getClientUrl, getServiceUrl} from "../../api/config-api";
import "./ScreenPlayground.css"
import ScreenLeaderboard from "../../components/ScreenLeaderboard/ScreenLeaderboard";

interface ScreenPlaygroundProps {
    isDebug?: boolean;
}

const ScreenPlayground: React.FC<ScreenPlaygroundProps> = (props: ScreenPlaygroundProps) => {
    const [error, setError] = React.useState<Error | undefined>();
    const [latestMessage, setLatestMessage] = React.useState<string>()
    const [roundNumber, setRoundNumber] = React.useState<number | undefined>(1);
    const [roundStatus, setRoundStatus] = React.useState<RoundStatus | undefined>()
    const [question, setQuestion] = React.useState<string | undefined>()
    const [answer, setAnswer] = React.useState<number | undefined>()
    const [providedAnswers, setProvidedAnswers] = React.useState<PlayerAnswer[]>([])
    const [leaderboard, setLeaderboard] = React.useState<PlayerScore[]>([])
    const fetchInterval = useRef<NodeJS.Timeout | null>(null);

    const joinLink = useMemo(() => {
        return getClientUrl() + "/#/welcome?serviceUrl=" + encodeURIComponent(getServiceUrl())
    }, [])

    const setRoundState = useCallback((roundResponse: RoundResponse) => {
        setError(undefined)
        setRoundNumber(roundResponse.roundNumber)
        setRoundStatus(roundResponse.roundStatus)
        setQuestion(roundResponse.question)
        setAnswer(roundResponse.answer)
        setProvidedAnswers(roundResponse.providedAnswers)
        console.log("Round status: " + roundResponse.roundStatus)
    }, [])

    const showLeaderboard = useCallback((leaderboard: LeaderboardResponse) => {
        setError(undefined)
        setRoundNumber(undefined)
        setLeaderboard(leaderboard.leaderboard)
        console.log("Leaderboard: " + leaderboard.leaderboard)
    }, [])

    useEffect(() => {
        if (roundNumber && roundStatus && [RoundStatus.STARTED, RoundStatus.STOPPING].includes(roundStatus)) {
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
    }, [roundNumber, roundStatus, setRoundState, fetchInterval])

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
        } else if (message.startsWith("show-leaderboard")) {
            getLeaderboard().then(showLeaderboard).catch(e => {
                setError(e)
            })
        }
    }, [setRoundState, showLeaderboard])

    useEffect(() => {
        if (roundNumber) {
            getRound().then(setRoundState).catch(e => {
                setError(e)
            })
        }
    }, [roundNumber, setRoundState])

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
        <div id={"screen-qrcode-container"}>
            <QRCodeGenerator url={joinLink} />
        </div>
        <WebSocketClient onSocketConnected={handleSocketConnected} onMessageReceived={handleMessageReceived}
                         isDebug={props.isDebug}
                         latestMessage={latestMessage} />
    </>
}

ScreenPlayground.defaultProps = {
    isDebug: true
}
export default ScreenPlayground;