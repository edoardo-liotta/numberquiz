const defaultConfiguration = () => {
    const deviceId = `${Math.ceil(Math.random()*1000)}`
    return {
        clientUrl: "http://localhost:3000",
        serviceUrl: "http://localhost:8080",
        deviceId: deviceId,
        playerId: `Player ${deviceId}`
    }
}

const getConfiguration = () => {
    if (window && window.localStorage) {
        if (window.localStorage.getItem("configuration") === null) {
            window.localStorage.setItem("configuration", JSON.stringify(defaultConfiguration()))
        }

        return JSON.parse(window.localStorage.getItem("configuration") || JSON.stringify(defaultConfiguration()))
    }

    return defaultConfiguration()
}

const setConfiguration = (newConfiguration: string) => {
    if (window && window.localStorage) {
        window.localStorage.setItem("configuration", JSON.stringify(newConfiguration))
    }
}

const resetConfiguration = () => {
    if (window && window.localStorage) {
        window.localStorage.removeItem("configuration")
    }
}

const getClientUrl = () => {
    return getConfiguration().clientUrl
}

const getServiceUrl = () => {
    return getConfiguration().serviceUrl
}

const getDeviceId = () => {
    return getConfiguration().deviceId
}

const getPlayerId = () => {
    return getConfiguration().playerId
}

export {getConfiguration, getClientUrl, getServiceUrl, getDeviceId, getPlayerId, resetConfiguration, setConfiguration}