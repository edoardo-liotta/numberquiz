import {getServiceUrl} from './config-api';

export interface ApiResponse {
    // Define the structure of your API response here
    // For example, if the response is { message: string }, you can use:
    // message: string;
    status: number;
}

export enum RoundStatus {
    IDLE = "IDLE",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
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

export const getRound = async (roundNumber: number): Promise<RoundResponse> => {
    return Promise.resolve(
        {
            status: 200,
            roundNumber: roundNumber,
            roundStatus: RoundStatus.IDLE,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Player 1"},{playerName: "Player 2"}]
        });
}

export const startRound = async (roundNumber: number): Promise<RoundResponse> => {
    return Promise.resolve(
        {
            status: 200,
            roundNumber: roundNumber,
            roundStatus: RoundStatus.IN_PROGRESS,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Player 1", providedAnswer: 42},{playerName: "Player 2"}]
        });
}

export const endRound = async (roundNumber: number): Promise<RoundResponse> => {
    return Promise.resolve(
        {
            status: 200,
            roundNumber: roundNumber,
            roundStatus: RoundStatus.FINISHED,
            question: "Domanda",
            answer: 42,
            providedAnswers: [{playerName: "Player 1", providedAnswer: 42},{playerName: "Player 2", providedAnswer: 10}]
        });
}