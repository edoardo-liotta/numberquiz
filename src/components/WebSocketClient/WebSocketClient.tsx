import React, {useCallback, useEffect, useRef} from 'react';
import {createSocketConnection} from "../../api/service-api";
import './WebSocketClient.css';

interface WebSocketClientProps {
    isDebug?: boolean;
    latestMessage?: string;
    onSocketConnected?: (socket: WebSocket) => void;
    onMessageReceived: (message: string) => void;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({
                                                             isDebug,
                                                             latestMessage,
                                                             onSocketConnected,
                                                             onMessageReceived
                                                         }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [statusMessage, setStatusMessage] = React.useState<string>("Disconnected");

    const disconnect = useCallback(() => {
        setStatusMessage("Disconnected")
        if (socketRef.current) {
            try {
                socketRef.current.close();
            } catch (e) {
                console.log("Error closing WebSocket connection");
                console.log(e);
            }
            socketRef.current = null;
        }
    }, [])

    const connect = useCallback(() => {
        if (!socketRef.current) {
            setStatusMessage("Connecting...");
            const socketConnection = createSocketConnection();

            // Handle connection open event
            socketConnection.onopen = () => {
                console.log('WebSocket client connected');
                socketRef.current = socketConnection;
                setStatusMessage("Connected");
                if (onSocketConnected && socketRef.current) {
                    onSocketConnected(socketRef.current);
                }
            };

            // Handle incoming message event
            socketConnection.onmessage = (event) => {
                onMessageReceived(event.data);
            };

            socketConnection.onerror = (event) => {
                console.log("WebSocket error");
                console.log(event.target);
                disconnect()
            };

            socketConnection.onclose = () => {
                disconnect()
            }
        }
    }, [disconnect, onSocketConnected, onMessageReceived])

    useEffect(() => {
        // Create a new WebSocket connection
        connect();

        // Clean up on component unmount
        return () => {
            disconnect();
        };
    }, [connect, disconnect, onSocketConnected, onMessageReceived]);

    return <>
        <div id={"websocketclient-status"}>WebSocket Client: {statusMessage}
        {statusMessage === "Disconnected" && <>
            &nbsp;<span className={"reconnect"} onClick={connect}>Connect</span>
            </>}
        </div>
        {isDebug && latestMessage && <>
          <div>Latest message: {latestMessage}</div>
        </>}
    </>;
};

WebSocketClient.defaultProps = {
    isDebug: true,
    latestMessage: undefined
}

export default WebSocketClient;
