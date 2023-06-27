import React, {useState} from 'react';
import './Dial.css';
import {OnConfirmAnswerProps} from "../../views/Playground/Playground";

interface DialProps {
    isDisabled?: boolean;
    onConfirmAnswer?: (args: OnConfirmAnswerProps) => void;
    text?: string;
    footerText?: string;
}

const Dial: React.FC<DialProps> = (props) => {
    const [value, setValue] = useState<number>(0);

    const handleDialTurn = (direction: 'clockwise' | 'counter-clockwise') => {
        if (direction === 'clockwise') {
            setValue((prevValue) => prevValue + 1);
        } else if (direction === 'counter-clockwise' && value > 0) {
            setValue((prevValue) => prevValue - 1);
        }
    };

    const triggerConfirmAnswer = () => {
        props.onConfirmAnswer && props.onConfirmAnswer({value})
    };

    return (
        <>
            <div className={"dial-container"}>
                <div>
                    <h1 className="dial-header-text">{props.text}</h1>
                    <div className="dial">
                        <div className="dial-button-row">
                            <button onClick={() => handleDialTurn('counter-clockwise')} disabled={props.isDisabled}>-
                            </button>
                            <button className={"value"}>{value}</button>
                            <button onClick={() => handleDialTurn('clockwise')} disabled={props.isDisabled}>+</button>
                        </div>
                        <button className={"dial-submit-button"} disabled={props.isDisabled}
                                onClick={triggerConfirmAnswer}>Conferma
                        </button>
                    </div>
                    <h3 className={"dial-footer-text"}>{props.footerText}</h3>
                </div>
            </div>
        </>
    );
};

Dial.defaultProps = {
    isDisabled: false,
    onConfirmAnswer: () => {
    },
    text: 'Default Text',
    footerText: 'Default Footer Text'
};

export default Dial;