import React, {useState} from 'react';
import './Dial.css';
import {sendAnswer} from "../../api/service-api";

interface DialProps {
    text?: string;
    footerText?: string;
}

const Dial: React.FC<DialProps> = ({text, footerText}) => {
    const [value, setValue] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handleDialTurn = (direction: 'clockwise' | 'counter-clockwise') => {
        if (direction === 'clockwise') {
            setValue((prevValue) => prevValue + 1);
        } else if (direction === 'counter-clockwise' && value > 0) {
            setValue((prevValue) => prevValue - 1);
        }
    };

    const triggerConfirmAnswer = () => {
        if (!isDisabled) {
            setIsDisabled(true);
            sendAnswer(value).then(r => {
                console.log("Answer sent successfully")
            })
                .catch(e => {
                    setIsDisabled(false)
                })
        }
    };

    return (
        <div className="container">
            <div className={"dial-container"}>
                <h1 className="header-text">{text}</h1>
                <div className="dial">
                    <div className="button-row">
                        <button onClick={() => handleDialTurn('counter-clockwise')} disabled={isDisabled}>-</button>
                        <button className={"value"}>{value}</button>
                        <button onClick={() => handleDialTurn('clockwise')} disabled={isDisabled}>+</button>
                    </div>
                    <button className={"submit-button"} onClick={triggerConfirmAnswer}>Conferma</button>
                </div>
                <h3 className={"footer-text"}>{footerText}</h3>
            </div>
        </div>
    );
};

Dial.defaultProps = {
    text: 'Default Text',
    footerText: 'Default Footer Text'
};

export default Dial;