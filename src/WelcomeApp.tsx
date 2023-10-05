import React from 'react';
import './App.css';
import {Link, useSearchParams} from "react-router-dom";
import Configuration from "./components/Configuration/Configuration";

function WelcomeApp() {
    const [searchParams] = useSearchParams();

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
