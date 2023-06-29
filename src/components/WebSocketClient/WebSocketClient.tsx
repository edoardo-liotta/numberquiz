import React, {useEffect, useRef} from 'react';
import {createSocketConnection} from "../../api/service-api";
import './WebSocketClient.css';

interface WebSocketClientProps {
    onMessageReceived: (message: string) => void;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({onMessageReceived}) => {
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectDelay = 500; // Delay in milliseconds before attempting reconnection
    const maxFailedReconnectAttempts = 5; // Maximum number of failed reconnection attempts before giving up
    const [failedReconnectAttempts, setFailedReconnectAttempts] = React.useState<number>(0);
    const [statusMessage, setStatusMessage] = React.useState<string>("Disconnected");

    const connect = (failedAttempts: number) => {
        socketRef.current = createSocketConnection();

        // Handle connection open event
        socketRef.current.onopen = () => {
            console.log('WebSocket client connected');
            setStatusMessage("Connected");
            setFailedReconnectAttempts(0);
            reconnectIntervalRef.current = null
        };

        // Handle incoming message event
        socketRef.current.onmessage = (event) => {
            onMessageReceived(event.data);
        };

        socketRef.current.onerror = (event) => {
            console.log("WebSocket error");
            setFailedReconnectAttempts(failedAttempts + 1);
        };
    }

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        if (reconnectIntervalRef.current) {
            clearInterval(reconnectIntervalRef.current);
            reconnectIntervalRef.current = null;
        }
    }

    const reconnect = (failedAttempts: number) => {
        if (!reconnectIntervalRef.current) {
            setStatusMessage("Error. Reconnecting...")
            reconnectIntervalRef.current = setInterval(() => {
                console.log('Attempting reconnection...');
                disconnect();
                connect(failedAttempts);
            }, reconnectDelay);
        }
    }

    useEffect(() => {
        setStatusMessage("Connecting...");
        // Create a new WebSocket connection
        connect(0);

        // Clean up on component unmount
        return () => {
            setStatusMessage("Disconnected")
            disconnect();
        };
    }, [onMessageReceived]);

    useEffect(() => {
        if (failedReconnectAttempts > 0 && failedReconnectAttempts < maxFailedReconnectAttempts) {
            reconnect(failedReconnectAttempts);
        } else {
            setStatusMessage("Error. Disconnected.")
            console.log('Maximum number of failed reconnection attempts reached');
        }
    }, [failedReconnectAttempts]);

    return <div id={"websocketclient-status"}>WebSocket Client: {statusMessage}</div>;
};

export default WebSocketClient;
