import {useEffect} from 'react';
import './App.css';
import {Link, useSearchParams} from "react-router-dom";
import Configuration from "./components/Configuration/Configuration";
import {getConfiguration, resetConfiguration} from './api/config-api';

function WelcomeApp() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (getConfiguration() === undefined) {
            resetConfiguration()
        }
    }, []);

    return (<>
        <nav>
            <ul>
                <li>
                    <Link to="/play">Play</Link>
                </li>
            </ul>
        </nav>
        <Configuration autoOpen={true} clientUrl={searchParams.get("clientUrl")}
                       serviceUrl={searchParams.get("serviceUrl")} />
    </>)
}


export default WelcomeApp;
