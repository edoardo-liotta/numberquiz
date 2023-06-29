import {Server, WebSocket} from "mock-socket";
import * as serviceApi from "./api/service-api";
import App from "./App";
import {render} from "@testing-library/react";

describe('App', () => {
    it('should render the basic playground', () => {
        const {getByText} = render(<App />);
        const questionText = getByText("In attesa di una domanda...");

        expect(questionText).toBeInTheDocument();
    })
})