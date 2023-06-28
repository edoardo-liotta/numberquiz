// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import * as serviceApi from "./api/service-api";
import {Server, WebSocket} from "mock-socket";

let mockServer: Server;
let createSocketConnectionMock: jest.SpyInstance;
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
    jest.restoreAllMocks();
});