import * as serviceApi from "../../api/service-api";
import {ApiResponse} from "../../api/service-api";
import {act, fireEvent, render} from "@testing-library/react";
import React from "react";
import Playground from "./Playground";
import {Server, WebSocket} from "mock-socket";

describe('Playground view', () => {
    let mockServer: Server;

    beforeEach(() => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return new Promise<ApiResponse>((resolve) => {
                console.log('mocked sendAnswer')
                resolve({status: 200});
            });
        });

        jest.spyOn(serviceApi, 'createSocketConnection').mockImplementation(() => {
            return new WebSocket('ws://Playground:8080/')
        });

        // Set up a mock WebSocket server
        mockServer = new Server('ws://Playground:8080/', {mock: false});
        mockServer.on('connection', _ => {
            console.log("Mock server received a connection");
        });
    });

    afterEach(() => {
        mockServer.stop();
    });

    it('should send the value to the server when the submit button is clicked', () => {
        const {getByText} = render(<Playground initialQuestion={"Number Quiz"} />);
        const addButton = getByText('+');
        const submitButton = getByText('Conferma');

        fireEvent.click(addButton);
        fireEvent.click(submitButton);

        expect(serviceApi.sendAnswer).toHaveBeenCalledWith(1);
    });

    it('should restore the submit button if something occurred when sending data', async () => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return Promise.reject()
        });

        const component = render(<Playground initialQuestion={"Number Quiz"} />);
        const addButton = component.getByText('+');
        const submitButton = component.getByText('Conferma');

        await act(() => {
            fireEvent.click(addButton);
            fireEvent.click(submitButton);
        })

        expect(addButton).not.toBeDisabled();
    });

    it('should show the Idle screen when the is no set question', () => {
        const component = render(<Playground />);
        const idleText = component.getByText('In attesa di una domanda...');

        expect(idleText).toBeInTheDocument();
    });

    it('should show the question when it is set', async () => {
        jest.useFakeTimers()
        const component = render(<Playground />);

        await act(() => {
            mockServer.emit('message', 'set-question|How many fingers are in a hand?');
            jest.advanceTimersByTime(1000);
        });

        const questionText = component.getByText('How many fingers are in a hand?');
        expect(questionText).toBeInTheDocument();
    });

    it('should clear the question when socket triggers clear', async () => {
        jest.useFakeTimers()
        const component = render(<Playground initialQuestion={"Initial question"} />);
        let questionText = component.getByText('Initial question');
        expect(questionText).toBeInTheDocument();

        await act(() => {
            mockServer.emit('message', 'clear-question');
            jest.advanceTimersByTime(1000);
        });

        expect(questionText).not.toBeInTheDocument();
    });
});