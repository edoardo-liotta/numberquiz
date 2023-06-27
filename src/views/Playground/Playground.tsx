import React from "react";
import Dial from "../../components/Dial/Dial";
import {sendAnswer} from "../../api/service-api";

export interface OnConfirmAnswerProps {
    value: number;
}

const Playground: React.FC = () => {
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>()

    const onConfirmAnswer = (props: OnConfirmAnswerProps) => {
        setError(undefined)
        if (!isDisabled) {
            setIsDisabled(true);
            sendAnswer(props.value).then(r => {
                console.log("Answer sent successfully")
            })
                .catch(e => {
                    setError(e)
                    setIsDisabled(false)
                })
        }
    }

    return <>
        <div className={"playground-container"}>
            <Dial isDisabled={isDisabled} onConfirmAnswer={onConfirmAnswer} text={"Header text"}
                  footerText={"Footer text"} />
            {error && <>
              <div className={"playground-error"}>
                Qualcosa è andato storto. Riprova.<br />
                  {error}
              </div>
            </>}
        </div>
    </>
}

export default Playground;