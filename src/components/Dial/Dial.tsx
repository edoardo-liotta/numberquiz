import React, {useState} from 'react';
import './Dial.css';
import {sendAnswer} from "../../api/service-api";

interface OnConfirmAnswerArgs {
    value: number;
}

interface DialProps {
    isDisabled?: boolean;
    onConfirmAnswer?: (args: OnConfirmAnswerArgs) => void;
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
        <div className="container">
            <div className={"dial-container"}>
                <h1 className="header-text">{props.text}</h1>
                <div className="dial">
                    <div className="button-row">
                        <button onClick={() => handleDialTurn('counter-clockwise')} disabled={props.isDisabled}>-</button>
                        <button className={"value"}>{value}</button>
                        <button onClick={() => handleDialTurn('clockwise')} disabled={props.isDisabled}>+</button>
                    </div>
                    <button className={"submit-button"} disabled={props.isDisabled} onClick={triggerConfirmAnswer}>Conferma</button>
                </div>
                <h3 className={"footer-text"}>{props.footerText}</h3>
            </div>
        </div>
    );
};

Dial.defaultProps = {
    isDisabled: false,
    onConfirmAnswer: () => {},
    text: 'Default Text',
    footerText: 'Default Footer Text'
};

export default Dial;