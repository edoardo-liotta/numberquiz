const defaultConfiguration = () => {
    const deviceId = `${Math.ceil(Math.random()*10)}`
    return {
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

const getServiceUrl = () => {
    return getConfiguration().serviceUrl
}

const getDeviceId = () => {
    return getConfiguration().deviceId
}

const getPlayerId = () => {
    return getConfiguration().playerId
}

export {getConfiguration, getServiceUrl, getDeviceId, getPlayerId, resetConfiguration, setConfiguration}