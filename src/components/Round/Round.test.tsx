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
        const {getByText} = render(<Round roundStatus={RoundStatus.STARTED} question={"Domanda"} answer={42} providedAnswers={[]} onTriggerStopRound={onTriggerEndRound} />);

        await waitFor(() => {
            getByText('Termina il round')
        })

        const endRoundButton = getByText('Termina il round')
        fireEvent.click(endRoundButton)

        expect(onTriggerEndRound).toHaveBeenCalled();
    });

    it('should trigger results display when clicking the button', async () => {
        const onTriggerDisplayAnswers = jest.fn();
        const {getByText} = render(<Round roundStatus={RoundStatus.STOPPED} question={"Domanda"} answer={42} providedAnswers={[]} onTriggerDisplayAnswers={onTriggerDisplayAnswers} />);

        await waitFor(() => {
            getByText('Mostra i risultati')
        })

        const displayAnswersButton = getByText('Mostra i risultati')
        fireEvent.click(displayAnswersButton)

        expect(onTriggerDisplayAnswers).toHaveBeenCalled();
    });

    it('should render the provided answers', async () => {
        const {getByText} = render(<Round roundStatus={RoundStatus.IDLE} question={"Domanda"} answer={42} providedAnswers={[{playerName: "Edoardo"},{playerName:"Antonietta", providedAnswer: 10}]} />);

        expect(getByText("Edoardo")).toBeInTheDocument()
        expect(getByText("-")).toBeInTheDocument()
        expect(getByText("Antonietta")).toBeInTheDocument()
        expect(getByText("10")).toBeInTheDocument()
    });
});