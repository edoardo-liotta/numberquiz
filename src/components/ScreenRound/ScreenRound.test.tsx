import ScreenRound from "./ScreenRound";
import {RoundStatus} from "../../api/service-api";
import {act, render} from "@testing-library/react";

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
        jest.useFakeTimers()
        const component = render(<ScreenRound roundNumber={1} roundStatus={RoundStatus.DISPLAYING_ANSWERS}
                                              question={"According to Douglas Adams' \"Hitchhiker's guide to the Galaxy\", what is the Answer to Life, the Universe and Everything?"}
                                              answer={42} providedAnswers={[{
            playerName: "Under",
            providedAnswer: 10
        }, {playerName: "Exact", providedAnswer: 42}, {playerName: "Over", providedAnswer: 43}]} />);

        for (let i = 0; i < 50; i++) {
            await act(() => jest.advanceTimersByTime(3000))
        }

        console.log(component.container.innerHTML)

        const answerBox = component.getAllByText("42")[0]
        expect(answerBox.className).toContain("screen-round-answer")

        const underPlayer = component.getByText("Under")
        expect(underPlayer.parentElement?.className).toContain("under")
        expect(component.getByText("10")).toBeInTheDocument()

        component.getByText("Exact ⭐")
        expect(component.getAllByText("42")).toHaveLength(2)

        const overPlayer = component.getByText("Over")
        expect(overPlayer.parentElement?.className).toContain("over")
        expect(component.getByText("43")).toBeInTheDocument()
    });
})