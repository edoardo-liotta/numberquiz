import ScreenRound from "./ScreenRound";
import {RoundStatus} from "../../api/service-api";
import {render} from "@testing-library/react";

describe('ScreenRound component', () => {
    it('should render the provided answers', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.IDLE} question={"Domanda"} providedAnswers={[{playerName: "Edoardo"},{playerName:"Antonietta", providedAnswer: 10}]} />);

        expect(getByText("Edoardo")).toBeInTheDocument()
        expect(getByText("Antonietta")).toBeInTheDocument()
        expect(getByText("✅")).toBeInTheDocument()
    });

    it('should show the round number when the round status is idle', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.IDLE} question={"Domanda"} providedAnswers={[]} />);
        expect(getByText("Round 1")).toBeInTheDocument()
    });

    it('should show the question when the round status is not idle', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.STARTED} question={"Domanda"} providedAnswers={[]} />);
        expect(getByText("Domanda")).toBeInTheDocument()
    });
})