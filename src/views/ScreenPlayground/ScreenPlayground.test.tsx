import {act, render, waitFor} from "@testing-library/react";
import * as serviceApi from "../../api/service-api";
import {RoundStatus} from "../../api/service-api";
import React from "react";
import {Server} from "mock-socket";
import ScreenPlayground from "./ScreenPlayground";

describe('Screen Playground component', () => {
    let createSocketConnectionMock;
    let mockServer: Server;

    beforeEach(() => {
        jest.spyOn(serviceApi, 'getRound').mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.IDLE,
            question: "Domanda",
            answer: 42,
            providedAnswers: []
        });

        createSocketConnectionMock = jest.spyOn(serviceApi, 'createSocketConnection').mockImplementation(() => {
            return new WebSocket('ws://ScreenPlayground:8080/')
        });

        // Set up a mock WebSocket server
        mockServer = new Server('ws://ScreenPlayground:8080/', {mock: false});
        mockServer.on('connection', _ => {
            console.log("Mock server received a connection");
        });
    });

    afterEach(() => {
        mockServer.stop();
    });
    it('should fetch the status information when loaded', async () => {
        const component = render(<ScreenPlayground />);
        await waitFor(() => component.container.querySelector('div'))
        expect(serviceApi.getRound).toHaveBeenCalledWith(1);
    })

    it('should fetch the status information when a WebSocket message is triggered', async () => {
        jest.useFakeTimers()
        render(<ScreenPlayground />);

        await act(() => {
            mockServer.emit('message', 'update-round');
            jest.advanceTimersByTime(1000);
        });

        expect(serviceApi.getRound).toHaveBeenCalledWith(1);
    })

    it('should fetch round status every second when round is in progress', async () => {
        jest.useFakeTimers()
        jest.spyOn(serviceApi, 'getRound').mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.STARTED,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo"}, {playerName: "Antonietta"}]
        }).mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.STARTED,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo"}, {playerName: "Antonietta"}]
        }).mockResolvedValueOnce({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.STOPPING,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo", providedAnswer: 10}, {playerName: "Antonietta"}]
        }).mockResolvedValue({
            status: 200,
            roundNumber: 1,
            roundStatus: RoundStatus.STOPPED,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Edoardo", providedAnswer: 10}, {
                playerName: "Antonietta",
                providedAnswer: 42
            }]
        });
        const component = render(<ScreenPlayground />);
        await act(() => {component.container.querySelector('div')})

        expect(serviceApi.getRound).toHaveBeenCalledTimes(1);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(2);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(3);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(4);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(4);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(4);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(4);
    })
})