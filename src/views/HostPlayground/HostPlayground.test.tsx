import * as serviceApi from "../../api/service-api";
import {RoundStatus} from "../../api/service-api";
import {fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import HostPlayground from "./HostPlayground";

describe('Host Playground component', () => {
    beforeEach(() => {
        jest.spyOn(serviceApi, 'getRound').mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IDLE,
            question: "Domanda",
            answer: 42,
            providedAnswers: []
        });

        jest.spyOn(serviceApi, 'startRound').mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IN_PROGRESS,
            question: "Domanda",
            answer: 42,
            providedAnswers: []
        });

        jest.spyOn(serviceApi, 'endRound').mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.FINISHED,
            question: "Domanda",
            answer: 42,
            providedAnswers: []
        });

        /*createSocketConnectionMock = jest.spyOn(serviceApi, 'createSocketConnection').mockImplementation(() => {
            return new WebSocket('ws://RoundView:8080/')
        });

        // Set up a mock WebSocket server
        mockServer = new Server('ws://RoundView:8080/', {mock: false});
        mockServer.on('connection', _ => {
            console.log("Mock server received a connection");
        });*/
    });

    /*afterEach(() => {
        mockServer.stop();
    });*/

    it('should fetch the status information when loaded', async () => {
        const {getByText} = render(<HostPlayground />);

        expect(serviceApi.getRound).toHaveBeenCalledWith(1);

        await waitFor(() => expect(getByText('Inizia il round')).toBeInTheDocument());
    });

    it('should start the round when clicking the button', async () => {
        const {getByText} = render(<HostPlayground />);

        await waitFor(() => {
            getByText('Inizia il round')
        })

        const startRoundButton = getByText('Inizia il round')
        fireEvent.click(startRoundButton)

        expect(serviceApi.startRound).toHaveBeenCalledWith(1);
        await waitFor(() => expect(startRoundButton).not.toBeInTheDocument())

        const endRoundButton = getByText('Termina il round')
        expect(endRoundButton).toBeInTheDocument()
    });

    it('should end the round when clicking the button', async () => {
        const {getByText} = render(<HostPlayground />);

        await waitFor(() => {
            getByText('Inizia il round')
        })

        const startRoundButton = getByText('Inizia il round')
        fireEvent.click(startRoundButton)

        expect(serviceApi.startRound).toHaveBeenCalledWith(1);
        await waitFor(() => expect(startRoundButton).not.toBeInTheDocument())

        const endRoundButton = getByText('Termina il round')
        fireEvent.click(endRoundButton)

        expect(serviceApi.endRound).toHaveBeenCalledWith(1);
        await waitFor(() => expect(endRoundButton).not.toBeInTheDocument())
    });

    it('should fetch round status every second and print any provided answer when round is in progress', async () => {
        jest.useFakeTimers()
        jest.spyOn(serviceApi, 'getRound').mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IDLE,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo"}, {playerName: "Antonietta"}]
        }).mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IN_PROGRESS,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo"}, {playerName: "Antonietta"}]
        }).mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IN_PROGRESS,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo", providedAnswer: 10}, {playerName: "Antonietta"}]
        }).mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IN_PROGRESS,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo", providedAnswer: 10}, {
                playerName: "Antonietta",
                providedAnswer: 42
            }]
        });
        const {getByText} = render(<HostPlayground />);
        await waitFor(() => {
            getByText('Inizia il round')
        })
        expect(serviceApi.getRound).toHaveBeenCalledTimes(1);
        const startRoundButton = getByText('Inizia il round')
        fireEvent.click(startRoundButton)
        await waitFor(() => expect(startRoundButton).not.toBeInTheDocument())

        jest.advanceTimersByTime(1000)
        expect(serviceApi.getRound).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(1000)
        expect(serviceApi.getRound).toHaveBeenCalledTimes(3);
        const endRoundButton = getByText('Termina il round')
        fireEvent.click(endRoundButton)
        await waitFor(() => getByText('Mostra i risultati'))
        jest.advanceTimersByTime(1000)
        expect(serviceApi.getRound).toHaveBeenCalledTimes(3);
        jest.advanceTimersByTime(1000)
        expect(serviceApi.getRound).toHaveBeenCalledTimes(3);
    });

    it('should render the provided answers', async () => {
        jest.useFakeTimers()
        jest.spyOn(serviceApi, 'getRound').mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.FINISHED,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo"}, {playerName: "Antonietta", providedAnswer: 10}]
        })

        const {getByText} = render(<HostPlayground />);
        await waitFor(() => {
            getByText('Mostra i risultati')
        })
        expect(getByText("Edoardo")).toBeInTheDocument()
        expect(getByText("-")).toBeInTheDocument()
        expect(getByText("Antonietta")).toBeInTheDocument()
        expect(getByText("10")).toBeInTheDocument()
    });
});