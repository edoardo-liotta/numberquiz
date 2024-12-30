import React, {useCallback} from "react";
import {sendAnswer} from "../../api/service-api";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";
import Idle from "../../components/Idle/Idle";
import {getDeviceId, getPlayerId} from "../../api/config-api";
import './Playground.css'
import {SurfaceDial} from "../../components/SurfaceDial/surface-dial";

interface PlaygroundProps {
  gameId: string,
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

  const {gameId} = props;

  const handleSocketConnected = useCallback((socket: WebSocket) => {
    socket.send(`register-player|${getDeviceId()}|${getPlayerId()}`)
  }, [])

  const handleMessageReceived = useCallback((message: string) => {
    console.log("Message received: " + message)
    if ((message !== latestMessage) && message.startsWith("set-question|")) {
      const newQuestion = (message.split("|"))[1];
      if (newQuestion.length > 0) {
        setCurrentQuestion(newQuestion)
        setIsDialDisabled(false)
      } else {
        setCurrentQuestion(undefined)
      }
    } else if (message.startsWith("clear-question")) {
      setCurrentQuestion(undefined)
    }
    setLatestMessage(message)
  }, [latestMessage])

  const onConfirmAnswer = useCallback((props: OnConfirmAnswerProps) => {
    setError(undefined)
    if (!isDialDisabled) {
      setIsDialDisabled(true);
      sendAnswer(gameId, props.value).then(() => {
        console.log("Answer sent successfully")
      })
        .catch(e => {
          setError(e)
          setIsDialDisabled(false)
        })
    }
  }, [gameId, isDialDisabled])

  return <>
    <div className={"playground-container"}>
      {!currentQuestion && <>
          <Idle/>
      </>}
      {currentQuestion && <>
          <SurfaceDial disabled={isDialDisabled} onConfirmAnswer={onConfirmAnswer} text={currentQuestion}/>
        {error && <>
            <div className={"playground-error"}>
                Qualcosa è andato storto. Riprova.<br/>
              {error.message}
            </div>
        </>}
      </>}
    </div>
    <WebSocketClient gameId={gameId} onSocketConnected={handleSocketConnected}
                     onMessageReceived={handleMessageReceived}/>
    <div className={"playground-vertical"}>Ruota lo schermo in orizzontale</div>
  </>
}

Playground.defaultProps = {
  initialQuestion: undefined,
  isDebug: false
}

export default Playground;