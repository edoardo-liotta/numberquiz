import React, {useState} from 'react';
import './Dial.css';
import {OnConfirmAnswerProps} from "../../views/Playground/Playground";

interface DialProps {
    isDisabled?: boolean;
    onConfirmAnswer?: (args: OnConfirmAnswerProps) => void;
    text?: string;
}

const Dial: React.FC<DialProps> = ({isDisabled, onConfirmAnswer, text}) => {
    const [value, setValue] = useState<number>(0);

    const handleDialTurn = (direction: 'clockwise' | 'counter-clockwise') => {
        if (direction === 'clockwise') {
            setValue((prevValue) => prevValue + 1);
        } else if (direction === 'counter-clockwise' && value > 0) {
            setValue((prevValue) => prevValue - 1);
        }
    };

    const triggerConfirmAnswer = () => {
        onConfirmAnswer && onConfirmAnswer({value})
    };

    return (
        <>
            <div className={"dial-container"}>
                <div className={"dial-inner-container"}>
                    <div className="dial-header-text"><h1>{text}</h1></div>
                    <div className="dial">
                        <div className="dial-button-row">
                            <button onClick={() => handleDialTurn('counter-clockwise')} disabled={isDisabled}>-
                            </button>
                            <button className={"value"}>{value}</button>
                            <button onClick={() => handleDialTurn('clockwise')} disabled={isDisabled}>+</button>
                        </div>
                        <button className={"dial-submit-button"} disabled={isDisabled}
                                onClick={triggerConfirmAnswer}>Conferma
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

Dial.defaultProps = {
    isDisabled: false,
    onConfirmAnswer: () => {
    },
    text: 'Default Text'
};

export default Dial;