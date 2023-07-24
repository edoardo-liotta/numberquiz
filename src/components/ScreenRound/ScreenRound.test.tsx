import ScreenRound from "./ScreenRound";
import {RoundStatus} from "../../api/service-api";
import {render} from "@testing-library/react";

describe('ScreenRound component', () => {
    it('should render the provided answers', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.IDLE} question={"Domanda"}
                                                providedAnswers={[{playerName: "Edoardo"}, {
                                                    playerName: "Antonietta",
                                                    providedAnswer: 10
                                                }]} />);

        expect(getByText("Edoardo")).toBeInTheDocument()
        expect(getByText("Antonietta")).toBeInTheDocument()
        expect(getByText("✅")).toBeInTheDocument()
    });

    it('should show the round number when the round status is idle', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.IDLE} question={"Domanda"}
                                                providedAnswers={[]} />);
        expect(getByText("Round 1")).toBeInTheDocument()
    });

    it('should show the question when the round status is not idle', async () => {
        const {getByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.PRESENTED} question={"Domanda"}
                                                providedAnswers={[]} />);
        expect(getByText("Domanda")).toBeInTheDocument()
    });

    it('should display the correct answer and the player score when the round status is displaying results', async () => {
        const {getByText, getAllByText} = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.DISPLAYING_ANSWERS}
                                                question={"According to Douglas Adams' \"Hitchhiker's guide to the Galaxy\", what is the Answer to Life, the Universe and Everything?"}
                                                answer={42} providedAnswers={[{
            playerName: "Under",
            providedAnswer: 10
        }, {playerName: "Exact", providedAnswer: 42}, {playerName: "Over", providedAnswer: 43}]} />);
        const answerBox = getAllByText("42")[0]
        expect(answerBox.className).toContain("screen-round-answer")

        const underPlayer = getByText("Under")
        expect(underPlayer.parentElement?.className).toContain("under")
        expect(getByText("10")).toBeInTheDocument()

        getByText("Exact ⭐")
        expect(getAllByText("42")).toHaveLength(2)

        const overPlayer = getByText("Over")
        expect(overPlayer.parentElement?.className).toContain("over")
        expect(getByText("43")).toBeInTheDocument()
    });
})