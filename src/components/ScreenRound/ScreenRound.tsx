import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {PlayerAnswer, RoundStatus} from "../../api/service-api";
import './ScreenRound.css'

interface CounterProps {
    roundNumber: number;
    roundStatus: RoundStatus;
    question: string;
    answer?: number;
    providedAnswers: PlayerAnswer[];
}

const maxIntervalDuration = 2000;
const minIntervalDuration = maxIntervalDuration / 10;
const maxIntervalDurationFraction = maxIntervalDuration / 20;
const ScreenRound: React.FC<CounterProps> = ({
                                                 roundNumber,
                                                 roundStatus,
                                                 question,
                                                 answer,
                                                 providedAnswers,
                                             }) => {
    const [currentCount, setCurrentCount] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [doneTicking, setDoneTicking] = useState(false);

    const sortedValidAnswers = useMemo(() => ([...providedAnswers]
            .map((pair) => pair.providedAnswer!)
            .filter((value, index, array) => array.indexOf(value) === index) // -> toSet
            .sort()
    ) || [], [providedAnswers]);

    const isDisplayingQuestion = roundStatus !== RoundStatus.IDLE;
    const isDisplayingAnswers = answer !== undefined && [RoundStatus.STOPPED, RoundStatus.DISPLAYING_ANSWERS].includes(roundStatus);

    const calculateDynamicInterval = useCallback((currentCount: number, targetNumber: number) => {
        // Adjust the interval duration based on the distance to the targetNumber
        const distanceToTarget = targetNumber - currentCount;
        const distanceToTargetFactor = maxIntervalDurationFraction * (distanceToTarget ** 2);
        //console.log("\ninterval duration: " + maxIntervalDuration + "\ndistance to target: " + distanceToTarget + "\ndistance factor: " + distanceToTargetFactor + "\ndynamic interval: " + dynamicInterval)
        return Math.max(maxIntervalDuration - distanceToTargetFactor, minIntervalDuration); // Adjust the factor (2) as needed
    }, []);

    const updateCounter = useCallback(() => {
        return () => {
            if (currentCount < Math.min(targetNumber, answer || 0)) {
                setCurrentCount((prevCount) => Math.min(prevCount + 1, targetNumber));
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            } else {
                // Stop the animation when the count reaches or exceeds the targetNumber
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);

                    // Check if there's a next pair to target, and if so, update the target
                    if (currentCount < (answer || 0)) {
                        if (currentPairIndex < sortedValidAnswers.length - 1) {
                            setCurrentPairIndex(currentPairIndex + 1);
                            setTargetNumber(sortedValidAnswers[currentPairIndex + 1]);
                        } else {
                            setTargetNumber(answer || 0);
                        }
                    } else {
                        // If it's the last tick, set the extra tick in progress and stop the animation
                        setDoneTicking(true);
                    }
                }
            }
        };
    }, [answer, currentCount, targetNumber, sortedValidAnswers, currentPairIndex]);

    // Create a memoized setTarget function
    const setTarget = useCallback(
        (newTarget: number) => {
            setTargetNumber(newTarget);
        },
        [setTargetNumber]
    );

    // Use a custom useInterval hook (not part of React) to handle intervals
    const useInterval = (callback: () => void, delay: number) => {
        const savedCallback = useCallback(callback, [callback]);

        useEffect(() => {
            if (roundStatus === RoundStatus.DISPLAYING_ANSWERS) {
                intervalRef.current = setInterval(() => {
                    savedCallback();
                }, calculateDynamicInterval(currentCount, targetNumber));
                return () => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                };
            }
        }, [delay, savedCallback]);
    };

    // Use useRef to store the intervalId
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Set up the interval using the custom useInterval hook
    useInterval(updateCounter(), maxIntervalDuration);

    useEffect(() => {
        if (roundStatus === RoundStatus.DISPLAYING_ANSWERS) {
            setTarget(Math.min(...sortedValidAnswers));
        }
    }, [sortedValidAnswers, setTarget, roundStatus]);

    useEffect(() => {
        // Check if the extra tick is in progress and stop the animation
        if (doneTicking && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [doneTicking]);

    return <>
        <div className={"screen-round-container"}>
            <div className={"screen-round-question-container"}>
                <div className={"screen-round-question"}>{roundStatus === RoundStatus.IDLE && <>Round {roundNumber}</>}
                    {isDisplayingQuestion && question}</div>
                {isDisplayingQuestion && <div
                    className={`screen-round-answer ${(!isDisplayingAnswers || currentCount === 0) ? "hidden" : ""} ${doneTicking ? "done-ticking" : ""} ${!doneTicking ? "ticking" : ""}`}>
                  <div style={{
                      width: `${currentCount}vw`,
                      backgroundColor: doneTicking ? 'darkblue' : 'blue',
                  }}></div>
                  &nbsp;{currentCount}
                </div>
                }
            </div>

            <ul className={"screen-round-players-container"}>
                {providedAnswers && providedAnswers.map(function (item) {
                    const numerator = Math.min(item.providedAnswer || 0, currentCount)
                    const tweakedNumerator = (item.providedAnswer && answer && doneTicking && (item.providedAnswer === answer)) ? numerator + 5 : numerator

                    const denominator = Math.max((item.providedAnswer || 1), currentCount)
                    const anyExactAnswer = providedAnswers.find((playerAnswer) => playerAnswer.providedAnswer === (answer || 0))
                    const tweakedDenominator = (anyExactAnswer && doneTicking) ? denominator + 5 : denominator
                    const overlayStyle: React.CSSProperties = {
                        position: 'absolute',
                        width: `calc(${Math.min(((item.providedAnswer && (item.providedAnswer > 0 && tweakedNumerator * 100 / tweakedDenominator)) || 0), 100)}% - 16px)`,
                        height: 'calc(100% - 16px)',
                        backgroundColor: 'blue',
                        opacity: 0.25, // Adjust the opacity as needed
                        display: (!doneTicking || (item.providedAnswer && (item.providedAnswer <= (answer || 0)))) || false ? 'block' : 'none',
                    };

                    const goldOverlayStyle: React.CSSProperties = {
                        float: 'right',
                        width: `calc(5% - 16px)`,
                        height: '100%',
                        backgroundColor: 'darkgoldenrod',
                        display: (doneTicking && (item.providedAnswer && (item.providedAnswer === (answer || 0)))) || false ? 'block' : 'none',
                    };

                    return <li
                        key={item.playerName}
                        style={{position: 'relative'}}
                        className={`screen-round-player ${(isDisplayingAnswers && (!item.providedAnswer || (item.providedAnswer === 0 || item.providedAnswer < currentCount)) && "under") || ""} ${(isDisplayingAnswers && item.providedAnswer && item.providedAnswer > answer && doneTicking && "over") || ""} ${(isDisplayingAnswers && item.providedAnswer && item.providedAnswer === answer && doneTicking && "exact") || ""}`}>
                        <div style={overlayStyle}>
                            <div style={goldOverlayStyle}></div>
                        </div>
                        <div
                            className={"screen-round-player-name"}>{item.playerName}{(isDisplayingAnswers && item.providedAnswer && item.providedAnswer === answer && doneTicking && " ⭐") || ""}</div>
                        <div
                            className={"screen-round-player-answer"}>{!isDisplayingAnswers && item.providedAnswer && "✅"}{(isDisplayingAnswers && (item.providedAnswer && (item.providedAnswer > 0) ? item.providedAnswer : "-"))}</div>
                    </li>
                })}
            </ul>
        </div>
    </>
};

export default ScreenRound;
