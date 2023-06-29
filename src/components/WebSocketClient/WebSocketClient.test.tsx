import React from 'react';
import WebSocketClient from './WebSocketClient';
import {act, render} from '@testing-library/react';
import {Server, WebSocket} from 'mock-socket';
import * as serviceApi from "../../api/service-api";

describe('WebSocketClient', () => {
    let mockServer: Server;
    let createSocketConnectionMock: jest.SpyInstance;
    const mockMessage = 'Test message';

    beforeEach(() => {
        createSocketConnectionMock = jest.spyOn(serviceApi, 'createSocketConnection').mockImplementation(() => {
            return new WebSocket('ws://WebSocketClient:8080/')
        });

        // Set up a mock WebSocket server
        mockServer = new Server('ws://WebSocketClient:8080/', {mock: false});
        mockServer.on('connection', _ => {
            console.log("Mock server received a connection");
        });
    });

    afterEach(() => {
        mockServer.stop();
    });

    it('should update field value on receiving a message', async () => {
        jest.useFakeTimers()
        const mockOnMessageReceived = jest.fn();
        // Render the component
        await act(() => {
            render(<WebSocketClient onMessageReceived={mockOnMessageReceived} />);
        });

        await act(() => {
            mockServer.emit('message', mockMessage);
            jest.advanceTimersByTime(1000);
        });

        expect(createSocketConnectionMock).toHaveBeenCalledTimes(1);
        // Assert that the field value is updated
        expect(mockOnMessageReceived).toHaveBeenCalledWith(mockMessage);
    });

    it('should test reconnection up to 5 times', async () => {
        jest.useFakeTimers()
        // Render the component
        await act(() => {
            render(<WebSocketClient onMessageReceived={jest.fn()} />);
        });

        expect(createSocketConnectionMock).toHaveBeenCalledTimes(1);

        for (let i = 0; i < 10; i++) {
            await act(() => {
                jest.advanceTimersByTime(1000);
                mockServer.emit('error', mockMessage);
                jest.advanceTimersByTime(100);
            });

            expect(createSocketConnectionMock).toHaveBeenCalledTimes((i + 1 <= 5 ? i + 1 : 5));
        }
    });
});
