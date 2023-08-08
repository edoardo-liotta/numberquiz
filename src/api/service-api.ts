import {getServiceUrl} from './config-api';

export interface ApiResponse {
    // Define the structure of your API response here
    // For example, if the response is { message: string }, you can use:
    // message: string;
    status: number;
}

export enum RoundStatus {
    IDLE = "IDLE",
    PRESENTED = "PRESENTED",
    STARTED = "STARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED",
    DISPLAYING_ANSWERS = "DISPLAYING_ANSWERS",
}

export interface RoundResponse extends ApiResponse {
    roundNumber: number;
    roundStatus: RoundStatus;
    question: string;
    answer: number;
    providedAnswers: PlayerAnswer[];
}

export interface PlayerAnswer {
    playerName: string;
    providedAnswer?: number;
}

export const createSocketConnection = () => {
    const url = new URL(getServiceUrl());
    return new WebSocket(`${(url.protocol === "https:" ? "wss" : "ws")}://${url.host}/connect`);
}

export const sendAnswer = async (answer: number): Promise<ApiResponse> => {
    return new Promise<ApiResponse>(() => {
    });
    // return fetch(`${(getServiceUrl())}/answer`, {
    //     method: "POST",
    //     body: JSON.stringify({answer}),
    //     headers: {
    //         "Content-Type": "application/json",
    //         "ngrok-skip-browser-warning": "any"
    //     }
    // }).then(r => {
    //     if (r.status >= 300) {
    //         Promise.reject()
    //     }
    //     return new Promise<ApiResponse>(() => r.json())
    // })
};

export const getRound = async (): Promise<RoundResponse> => {
    return fetch(`${(getServiceUrl())}/round`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "any"
        }
    }).then(r => {
        if (r.status >= 300) {
            Promise.reject()
        }
        return Promise.resolve<RoundResponse>(r.json())
    })
}

export const startRound = async (): Promise<RoundResponse> => {
    return fetch(`${(getServiceUrl())}/round/start`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "any"
        }
    }).then(r => {
        if (r.status >= 300) {
            Promise.reject()
        }
        return Promise.resolve<RoundResponse>(r.json())
    })
}

export const stopRound = async (): Promise<RoundResponse> => {
    return fetch(`${(getServiceUrl())}/round/stop`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "any"
        }
    }).then(r => {
        if (r.status >= 300) {
            Promise.reject()
        }
        return Promise.resolve<RoundResponse>(r.json())
    })
}