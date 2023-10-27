import {act, render, waitFor} from "@testing-library/react";
import * as serviceApi from "../../api/service-api";
import {RoundStatus} from "../../api/service-api";
import * as configApi from "../../api/config-api";
import React from "react";
import {Server} from "mock-socket";
import ScreenPlayground from "./ScreenPlayground";

describe('Screen Playground component', () => {
    let createSocketConnectionMock: jest.SpyInstance<WebSocket, []>;
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

        // Set up a mock WebSocket server
        mockServer = new Server('ws://ScreenPlayground:8080/', {mock: true});
        mockServer.on('connection', _ => {
            console.log("Mock server received a connection");
        });

        createSocketConnectionMock = jest.spyOn(serviceApi, 'createSocketConnection').mockImplementation(() => {
            return new WebSocket('ws://ScreenPlayground:8080/')
        });
    });

    afterEach(() => {
        mockServer.stop();
    });
    it('should fetch the status information when loaded', async () => {
        const component = render(<ScreenPlayground />);
        await waitFor(() => component.container.querySelector('div'))
        expect(serviceApi.getRound).toHaveBeenCalled();
    })

    it('should fetch the status information when a WebSocket message is triggered', async () => {
        jest.useFakeTimers()
        render(<ScreenPlayground />);

        await act(() => {
            mockServer.emit('message', 'update-round');
            jest.advanceTimersByTime(1000);
        });

        expect(serviceApi.getRound).toHaveBeenCalled();
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
        await act(() => {
            component.container.querySelector('div')
        })

        expect(serviceApi.getRound).toHaveBeenCalledTimes(1);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(2);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(3);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(4);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(5);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(5);
        await act(() => jest.advanceTimersByTime(1000))
        expect(serviceApi.getRound).toHaveBeenCalledTimes(5);
    })

    it('should display the qrcode section', async () => {
        jest.spyOn(configApi, 'getClientUrl').mockImplementation(() => "http://client.url")
        jest.spyOn(configApi, 'getServiceUrl').mockImplementation(() => "http://server.url")

        const {container, findByText} = render(<ScreenPlayground />);
        expect(container.querySelector('div#screen-qrcode-container')).toBeInTheDocument();
        const findByText1 = await act(() => findByText("http://client.url/#/welcome?serviceUrl=http%3A%2F%2Fserver.url"));
        expect(findByText1).toBeInTheDocument();
    });

    it('should display the leaderboard section', async () => {
        jest.useFakeTimers()
        jest.spyOn(serviceApi, 'getLeaderboard').mockResolvedValue({
            status: 200, leaderboard: [
                {
                    playerName: "Leader",
                    standardPoints: 30,
                    goldPoints: 0,
                    exactAnswers: 0,
                    overAnswers: 0,
                    totalScore: 30
                },
                {
                    playerName: "Runner-up",
                    standardPoints: 15,
                    goldPoints: 5,
                    exactAnswers: 1,
                    overAnswers: 0,
                    totalScore: 20
                },
                {
                    playerName: "Third",
                    standardPoints: 15,
                    goldPoints: 5,
                    exactAnswers: 1,
                    overAnswers: 1,
                    totalScore: 20
                },
                {
                    playerName: "Fourth",
                    standardPoints: 20,
                    goldPoints: 0,
                    exactAnswers: 0,
                    overAnswers: 0,
                    totalScore: 20
                },
                {playerName: "Last", standardPoints: 5, goldPoints: 5, exactAnswers: 1, overAnswers: 0, totalScore: 10},
            ]
        })

        const {getByText} = render(<ScreenPlayground />);

        await act(() => mockServer.emit('message', 'show-leaderboard'));
        await act(() => jest.advanceTimersByTime(1000))

        expect(createSocketConnectionMock).toHaveBeenCalled();
        expect(await act(() => getByText("Leader"))).toBeInTheDocument();
        expect(serviceApi.getLeaderboard).toHaveBeenCalled();
    })
})