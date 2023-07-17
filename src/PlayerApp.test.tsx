import {render} from "@testing-library/react";
import PlayerApp from "./PlayerApp";

describe('App', () => {
    it('should render the basic playground', () => {
        const {getByText} = render(<PlayerApp />);
        const questionText = getByText("In attesa di una domanda...");

        expect(questionText).toBeInTheDocument();
    })
})