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
            return new WebSocket('ws://localhost:8080/')
        });

        // Set up a mock WebSocket server
        mockServer = new Server('ws://localhost:8080/', {mock: false});
        mockServer.on('connection', socket => {
            console.log("Connected to mock server");

        });
    });

    afterEach(() => {
        mockServer.stop();
    });

    it('should update field value on receiving a message', async () => {
        const mockOnMessageReceived = jest.fn();
        // Render the component
        await act(() => {
            render(<WebSocketClient onMessageReceived={mockOnMessageReceived} />);
        });

        await act(() => {
            mockServer.emit('message', mockMessage);
        });


        // Assert that the field value is updated
        expect(mockOnMessageReceived).toHaveBeenCalledWith(mockMessage);
    });
});
