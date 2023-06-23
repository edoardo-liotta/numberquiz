import {getServiceUrl} from './config-api';

export interface ApiResponse {
    // Define the structure of your API response here
    // For example, if the response is { message: string }, you can use:
    // message: string;
    status: number;
}

export const sendAnswer = async (answer: number): Promise<ApiResponse> => {
    return fetch(`${(getServiceUrl())}/answer`, {
        method: "POST",
        body: JSON.stringify({answer}),
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "any"
        }
    }).then(r => {
        if (r.status >= 300) {
            Promise.reject()
        }
        return new Promise<ApiResponse>(() => r.json())
    })
};
