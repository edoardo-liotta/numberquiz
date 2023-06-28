import React from "react";
import Dial from "../../components/Dial/Dial";
import {sendAnswer} from "../../api/service-api";
import WebSocketClient from "../../components/WebSocketClient/WebSocketClient";

export interface OnConfirmAnswerProps {
    value: number;
}

const Playground: React.FC = () => {
    const [isDialDisabled, setIsDialDisabled] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>()
    const [latestMessage, setLatestMessage] = React.useState<string>()
    const [currentQuestion, setCurrentQuestion] = React.useState<string>("Number Quiz")

    const handleMessageReceived = (message: string) => {
        console.log("Message received: " + message)
        setLatestMessage(message)
    }

    const onConfirmAnswer = (props: OnConfirmAnswerProps) => {
        setError(undefined)
        if (!isDialDisabled) {
            setIsDialDisabled(true);
            sendAnswer(props.value).then(r => {
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
            <Dial isDisabled={isDialDisabled} onConfirmAnswer={onConfirmAnswer} text={currentQuestion}
                  footerText={""} />
            {error && <>
              <div className={"playground-error"}>
                Qualcosa è andato storto. Riprova.<br />
                  {error}
              </div>
            </>}
        </div>
        <WebSocketClient onMessageReceived={handleMessageReceived} />
    </>
}

export default Playground;