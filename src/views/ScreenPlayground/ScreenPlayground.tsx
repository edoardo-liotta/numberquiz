import React, {useCallback, useEffect, useMemo, useRef} from "react";
import ScreenCanvas from "../../components/ScreenCanvas/ScreenCanvas";
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
import QRCodeGenerator from "../../components/QRCodeGenerator/QRCodeGenerator";
import {getClientUrl, getServiceUrl} from "../../api/config-api";
import "./ScreenPlayground.css"

interface ScreenPlaygroundProps {
    gameId: string
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
        return getClientUrl() + `/#/welcome?gameId=${props.gameId}&serviceUrl=` + encodeURIComponent(getServiceUrl())
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

    const handleSocketConnected = useCallback((socket: WebSocket) => {
        setError(undefined)
        socket.send("register-screen")
    }, [])

    const handleMessageReceived = useCallback((message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
        if (message.startsWith("update")) {
            if (roundNumber) {
                getRound().then(setRoundState).catch(e => {
                    setError(e)
                })
            } else {
                getLeaderboard(props.gameId).then(showLeaderboard).catch(e => {
                    setError(e)
                })
            }
        }
        else if (message.startsWith("show-round")) {
            getRound().then(setRoundState).catch(e => {
                setError(e)
            })
        } else if (message.startsWith("show-leaderboard")) {
            getLeaderboard(props.gameId).then(showLeaderboard).catch(e => {
                setError(e)
            })
        }
    }, [roundNumber, setRoundState, showLeaderboard])

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

    useEffect(() => {
        if (roundNumber) {
            getRound().then(setRoundState).catch(e => {
                setError(e)
            })
        }
    }, [roundNumber, setRoundState])

    return <>
        <ScreenCanvas error={error} roundNumber={roundNumber} roundStatus={roundStatus} question={question} answer={answer} providedAnswers={providedAnswers} leaderboard={leaderboard} />
        <div id={"screen-qrcode-container"}>
            <QRCodeGenerator url={joinLink} />
        </div>
        <WebSocketClient gameId={props.gameId} onSocketConnected={handleSocketConnected} onMessageReceived={handleMessageReceived} />
    </>
}

ScreenPlayground.defaultProps = {
    isDebug: false
}
export default ScreenPlayground;