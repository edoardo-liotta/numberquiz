const defaultConfiguration = () => {
    return {
        serviceUrl: "http://localhost:8080"
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

export {getConfiguration, getServiceUrl, resetConfiguration, setConfiguration}