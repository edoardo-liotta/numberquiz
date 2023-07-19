import {RoundStatus} from "../../api/service-api";
import {fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import Round from "./Round";

describe('Round component', () => {
    it('should start the round when clicking the button', async () => {
        const onTriggerStartRound = jest.fn();
        const {getByText} = render(<Round roundStatus={RoundStatus.IDLE} question={"Domanda"} answer={42} providedAnswers={[]} onTriggerStartRound={onTriggerStartRound} />);

        await waitFor(() => {
            getByText('Inizia il round')
        })

        const startRoundButton = getByText('Inizia il round')
        fireEvent.click(startRoundButton)

        expect(onTriggerStartRound).toHaveBeenCalled();
    });

    it('should end the round when clicking the button', async () => {
        const onTriggerEndRound = jest.fn();
        const {getByText} = render(<Round roundStatus={RoundStatus.STARTED} question={"Domanda"} answer={42} providedAnswers={[]} onTriggerEndRound={onTriggerEndRound} />);

        await waitFor(() => {
            getByText('Termina il round')
        })

        const endRoundButton = getByText('Termina il round')
        fireEvent.click(endRoundButton)

        expect(onTriggerEndRound).toHaveBeenCalled();
    });

    it('should render the provided answers', async () => {
        const {getByText} = render(<Round roundStatus={RoundStatus.IDLE} question={"Domanda"} answer={42} providedAnswers={[{playerName: "Edoardo"},{playerName:"Antonietta", providedAnswer: 10}]} />);

        expect(getByText("Edoardo")).toBeInTheDocument()
        expect(getByText("-")).toBeInTheDocument()
        expect(getByText("Antonietta")).toBeInTheDocument()
        expect(getByText("10")).toBeInTheDocument()
    });
});