import {getDeviceId, getPlayerId, getServiceUrl} from './config-api';

export interface ApiResponse {
  status: number;
}

export enum RoundStatus {
  IDLE = "IDLE",
  PRESENTED = "PRESENTED",
  STARTED = "STARTED",
  STOPPING = "STOPPING",
  STOPPED = "STOPPED",
  DISPLAYING_ANSWERS = "DISPLAYING_ANSWERS",
  ENDED = "ENDED"
}

export interface RoundResponse extends ApiResponse {
  roundNumber: number;
  roundStatus: RoundStatus;
  question: string;
  answer: number;
  providedAnswers: PlayerAnswer[];
}

export interface LeaderboardResponse extends ApiResponse {
  leaderboard: PlayerScore[];
}

export interface PlayerAnswer {
  playerName: string;
  providedAnswer?: number;
}

export interface PlayerScore {
  playerName: string;
  standardPoints: number;
  goldPoints: number;
  exactAnswers: number;
  overAnswers: number;
  totalScore: number;
}

export const createSocketConnection = (gameId: string) => {
  const url = new URL(getServiceUrl());
  return new WebSocket(`${(url.protocol === "https:" ? "wss" : "ws")}://${url.host}/connect?gameId=${gameId}`);
}

export const sendAnswer = async (gameId: string, answer: number): Promise<ApiResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      playerId: getDeviceId(),
      playerName: getPlayerId(),
      providedAnswer: answer
    }),
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject(r)
    }
    return Promise.resolve<ApiResponse>(r.json())
  }).catch(e => {
    console.log(e)
    return Promise.reject(e)
  })
};

export const getRound = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/round`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}

export const startRound = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/round/start`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}

export const stopRound = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/round/stop`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}

export const showRoundResults = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/round/display-answers`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}

export const awardPoints = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/round/award-points`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}

export const getLeaderboard = async (gameId: string): Promise<LeaderboardResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/leaderboard`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<LeaderboardResponse>(r.json())
  })
}

export const triggerShowLeaderboard = async (gameId: string): Promise<ApiResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/host/show-leaderboard`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<ApiResponse>(r.json())
  })
}

export const triggerShowRound = async (gameId: string): Promise<ApiResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/host/show-round`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "Bypass-Tunnel-Reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<ApiResponse>(r.json())
  })
}

export const advanceToNextRound = async (gameId: string): Promise<RoundResponse> => {
  return fetch(`${(getServiceUrl())}/game/${gameId}/host/advance-to-next-round`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "any",
      "bypass-tunnel-reminder": "any"
    }
  }).then(r => {
    if (r.status >= 300) {
      return Promise.reject()
    }
    return Promise.resolve<RoundResponse>(r.json())
  })
}