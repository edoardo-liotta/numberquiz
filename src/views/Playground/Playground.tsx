import React, {useCallback} from "react";
import Dial from "../../components/Dial/Dial";
import {sendAnswer} from "../../api/service-api";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";
import Idle from "../../components/Idle/Idle";
import {getDeviceId, getPlayerId} from "../../api/config-api";
import './Playground.css'

interface PlaygroundProps {
    initialQuestion?: string;
    isDebug?: boolean;
}

export interface OnConfirmAnswerProps {
    value: number;
}

const Playground: React.FC<PlaygroundProps> = (props: PlaygroundProps) => {
    const [isDialDisabled, setIsDialDisabled] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Error | undefined>()
    const [latestMessage, setLatestMessage] = React.useState<string>()
    const [currentQuestion, setCurrentQuestion] = React.useState<string | undefined>(props.initialQuestion)

    const handleSocketConnected = useCallback((socket: WebSocket) => {
        socket.send(`register-player|${getDeviceId()}|${getPlayerId()}`)
    }, [])

    const handleMessageReceived = useCallback((message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
        if (message.startsWith("set-question|")) {
            let newQuestion = (message.split("|"))[1];
            if (newQuestion.length > 0) {
                setCurrentQuestion(newQuestion)
            } else {
                setCurrentQuestion(undefined)
            }
        } else if (message.startsWith("clear-question")) {
            setCurrentQuestion(undefined)
        }
    }, [])

    const onConfirmAnswer = (props: OnConfirmAnswerProps) => {
        setError(undefined)
        if (!isDialDisabled) {
            setIsDialDisabled(true);
            sendAnswer(props.value).then(() => {
                console.log("Answer sent successfully")
            })
                .catch(e => {
                    setError(e)
                    setIsDialDisabled(false)
                })
        }
    }

    return <>
        <div className={"playground-container"}>
            {!currentQuestion && <>
              <Idle />
            </>}
            {currentQuestion && <>
              <Dial isDisabled={isDialDisabled} onConfirmAnswer={onConfirmAnswer} text={currentQuestion} />
                {error && <>
                  <div className={"playground-error"}>
                    Qualcosa è andato storto. Riprova.<br />
                      {error.message}
                  </div>
                </>}
            </>}
        </div>
        <WebSocketClient onSocketConnected={handleSocketConnected} onMessageReceived={handleMessageReceived} isDebug={props.isDebug}
                         latestMessage={latestMessage} />
        <div className={"playground-vertical"}>Ruota lo schermo in orizzontale</div>
    </>
}

Playground.defaultProps = {
    initialQuestion: undefined,
    isDebug: true
}

export default Playground;