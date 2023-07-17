import * as serviceApi from "../../api/service-api";
import {RoundResponse, RoundStatus} from "../../api/service-api";
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import RoundView from "./RoundView";

describe('Round view', () => {
    beforeEach(() => {
        jest.spyOn(serviceApi, 'getRound').mockImplementation(() => {
            return new Promise<RoundResponse>((resolve) => {
                console.log('mocked getRound')
                resolve({
                    status: 200,
                    roundNumber: 1,
                    roundStatus: RoundStatus.IDLE,
                    question: "Domanda",
                    answer: 42,
                    providedAnswers: []
                });
            });
        });

        jest.spyOn(serviceApi, 'startRound').mockImplementation(() => {
            return new Promise<RoundResponse>((resolve) => {
                console.log('mocked startRound')
                resolve({
                    status: 200,
                    roundNumber: 1,
                    roundStatus: RoundStatus.IN_PROGRESS,
                    question: "Domanda",
                    answer: 42,
                    providedAnswers: []
                });
            });
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
        const {getByText} = render(<RoundView roundNumber={1} />);

        expect(serviceApi.getRound).toHaveBeenCalledWith(1);

        await waitFor(() => expect(getByText('Inizia il round')).toBeInTheDocument());
    });

    it('should start the round when clicking the button', async () => {
        const {getByText} = render(<RoundView roundNumber={1} />);

        await waitFor(() => {
            getByText('Inizia il round')
        })

        const startRoundButton = getByText('Inizia il round')
        await act(() => fireEvent.click(startRoundButton))

        expect(serviceApi.startRound).toHaveBeenCalledWith(1);
        await waitFor(() => expect(startRoundButton).not.toBeInTheDocument())

        const endRoundButton = getByText('Termina il round')
        expect(endRoundButton).toBeInTheDocument()
    });
});