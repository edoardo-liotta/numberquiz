import React, {useCallback, useEffect, useRef, useState} from 'react';

interface Pair {
    name: string;
    value: number;
}

interface CounterProps {
    pairs: Pair[];
    goalNumber: number;
}

const maxIntervalDuration = 2000;
const minIntervalDuration = maxIntervalDuration / 10;
const maxIntervalDurationFraction = maxIntervalDuration / 20;
const CounterComponent: React.FC<CounterProps> = ({pairs, goalNumber}) => {
    const [currentCount, setCurrentCount] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);

    // Create a state variable to track the current pair index
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    // Create a state variable to track the extra tick
    const [doneTicking, setDoneTicking] = useState(false);

    // Calculate the lowest value from the pairs
    const lowestValue = Math.min(...pairs.map((pair) => pair.value));

    // Filter pairs where the value does not exceed the goal number and sort them by ascending value
    const filteredPairs = pairs.filter((pair) => pair.value <= goalNumber).sort((a, b) => a.value - b.value);

    // Create a memoized function to calculate the dynamic interval
    const calculateDynamicInterval = useCallback((currentCount: number, targetNumber: number) => {
        // Adjust the interval duration based on the distance to the targetNumber
        const distanceToTarget = targetNumber - currentCount;
        const distanceToTargetFactor = maxIntervalDurationFraction * (distanceToTarget ** 2);
        const dynamicInterval = Math.max(maxIntervalDuration - distanceToTargetFactor, minIntervalDuration);
        console.log("\ninterval duration: " + maxIntervalDuration + "\ndistance to target: " + distanceToTarget + "\ndistance factor: " + distanceToTargetFactor + "\ndynamic interval: " + dynamicInterval)
        return dynamicInterval; // Adjust the factor (2) as needed
    }, []);

    // Create a memoized updateCounter function
    const updateCounter = useCallback(() => {
        return () => {
            if (currentCount < targetNumber) {
                setCurrentCount((prevCount) => Math.min(prevCount + 1, targetNumber));
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            } else {
                // Stop the animation when the count reaches or exceeds the targetNumber
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);

                    // Check if there's a next pair to target, and if so, update the target
                    if (currentPairIndex < filteredPairs.length - 1) {
                        setCurrentPairIndex(currentPairIndex + 1);
                        setTargetNumber(filteredPairs[currentPairIndex + 1].value);
                    } else {
                        // If it's the last tick, set the extra tick in progress and stop the animation
                        setDoneTicking(true);
                    }
                }
            }
        };
    }, [currentCount, targetNumber, filteredPairs, currentPairIndex]);

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
            intervalRef.current = setInterval(() => {
                savedCallback();
            }, calculateDynamicInterval(currentCount, targetNumber));
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }, [delay, savedCallback]);
    };

    // Use useRef to store the intervalId
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    // Set up the interval using the custom useInterval hook
    useInterval(updateCounter(), maxIntervalDuration);

    useEffect(() => {
        // Set the initial target number when the component mounts
        setTarget(lowestValue);
    }, [lowestValue, setTarget]);

    useEffect(() => {
        // Check if the extra tick is in progress and stop the animation
        if (doneTicking && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [doneTicking]);

    return (
        <div>
            <h1>Counter: {Math.floor(currentCount)}</h1>
            <h2>Target Number: {targetNumber}</h2>
            <ul>
                {filteredPairs.map((pair, index) => (
                    <li key={index}>
                        {pair.name}: {pair.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CounterComponent;


// const distanceToTarget = targetNumber - nextCount;
// const distanceToTargetFactor = maxIntervalDurationFraction * (distanceToTarget ** 2);
// const dynamicInterval = Math.max(maxIntervalDuration - distanceToTargetFactor, minIntervalDuration); // Adjust the factor (2) as needed
// if (intervalRef.current) {
//     clearInterval(intervalRef.current);
//     console.log("\ninterval duration: " + maxIntervalDuration + "\ndistance to target: " + distanceToTarget + "\ndistance factor: " + distanceToTargetFactor + "\ndynamic interval: " + dynamicInterval)
// }
// intervalRef.current = setInterval(updateCounter, dynamicInterval);
// return nextCount