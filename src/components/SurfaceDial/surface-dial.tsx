import React, {useCallback, useEffect, useRef, useState} from 'react';
import './surface-dial.css';
import {OnConfirmAnswerProps} from "../../views/Playground/Playground";

interface DialProps {
  size?: number;
  min?: number;
  max?: number;
  stepsPerRevolution?: number;
  sensitivity?: number;
  disabled: boolean;
  onChange?: (value: number) => void;
  text?: string;
  onConfirmAnswer?: (args: OnConfirmAnswerProps) => void;
}

export const SurfaceDial: React.FC<DialProps> = ({
  size = 200,
  min = 1,
  max = 100,
  stepsPerRevolution = 10,
  sensitivity = 1,
  disabled,
  onChange,
  text,
  onConfirmAnswer
}) => {
  const [value, setValue] = useState(min);
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isAtLimit, setIsAtLimit] = useState(false);
  const [limitShake, setLimitShake] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef(0);
  const shakeTimeout = useRef<number>();

  const calculateAngle = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dialRef.current || disabled) return 0;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    return angle * (180 / Math.PI);
  }, [disabled]);

  const triggerResistanceFeedback = useCallback(() => {
    if (!isAtLimit && !disabled) {
      setIsAtLimit(true);
      const shake = () => {
        setLimitShake(prev => {
          if (prev === 0) return 2;
          if (prev === 2) return -2;
          return 0;
        });
      };

      shake();
      shakeTimeout.current = window.setTimeout(() => {
        shake();
        shakeTimeout.current = window.setTimeout(() => {
          setLimitShake(0);
          setIsAtLimit(false);
        }, 50);
      }, 50);
    }
  }, [isAtLimit, disabled]);

  useEffect(() => {
    if (disabled && isRotating) {
      handleRotationEnd();
    }
  }, [disabled]);

  const handleRotationStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    setIsRotating(true);
    lastAngle.current = calculateAngle(event.nativeEvent);
  }, [calculateAngle, disabled]);

  const handleRotationMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isRotating || disabled) return;

    const currentAngle = calculateAngle(event);
    let deltaAngle = currentAngle - lastAngle.current;

    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    deltaAngle *= sensitivity;
    const newRotation = rotation + deltaAngle;
    const degreesPerStep = 360 / stepsPerRevolution;
    const totalSteps = Math.round(newRotation / degreesPerStep);
    const newValue = min + totalSteps;

    if (newValue >= min && newValue <= max) {
      setRotation(newRotation);
      setValue(newValue);
      onChange?.(newValue);
      setIsAtLimit(false);
    } else {
      triggerResistanceFeedback();
    }

    lastAngle.current = currentAngle;

  }, [isRotating, calculateAngle, rotation, sensitivity, stepsPerRevolution, min, max, onChange, triggerResistanceFeedback, disabled]);

  const handleRotationEnd = useCallback(() => {
    setIsRotating(false);
    setIsAtLimit(false);
    setLimitShake(0);
    if (shakeTimeout.current) {
      clearTimeout(shakeTimeout.current);
    }
  }, []);

  useEffect(() => {
    if (isRotating && !disabled) {
      window.addEventListener('mousemove', handleRotationMove);
      window.addEventListener('mouseup', handleRotationEnd);
      window.addEventListener('touchmove', handleRotationMove);
      window.addEventListener('touchend', handleRotationEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleRotationMove);
      window.removeEventListener('mouseup', handleRotationEnd);
      window.removeEventListener('touchmove', handleRotationMove);
      window.removeEventListener('touchend', handleRotationEnd);
      if (shakeTimeout.current) {
        clearTimeout(shakeTimeout.current);
      }
    };
  }, [isRotating, handleRotationMove, handleRotationEnd, disabled]);

  const visualRotation = rotation % 360;

  const triggerConfirmAnswer = () => {
    onConfirmAnswer && onConfirmAnswer({value})
  };

  return (
    <div className="surface-dial-container">
      <div className="dial-header-text"><h1>{text}</h1></div>
      <div
        ref={dialRef}
        className={`surface-dial ${disabled ? 'disabled' : ''} ${isRotating ? 'rotating' : ''} ${isAtLimit ? 'at-limit' : ''}`}
        style={{
          width: size,
          height: size,
          transform: `rotate(${visualRotation + limitShake}deg)`
        }}
        onMouseDown={handleRotationStart}
        onTouchStart={handleRotationStart}
      >
        <div
          className={`surface-dial-marker ${isAtLimit ? 'at-limit' : ''} ${disabled ? 'disabled' : ''}`}
        />
        <div
          className="surface-dial-gradient"
          style={{
            background: `radial-gradient(circle at center, 
              rgba(${isAtLimit ? '255,0,0' : '255,255,255'},${disabled ? '0.05' : '0.1'}) 0%, 
              rgba(${isAtLimit ? '255,0,0' : '255,255,255'},0) 70%)`
          }}
        />
      </div>
      <div className={`surface-dial-value ${disabled ? 'disabled' : ''}`}>
        {value}
      </div>
      <button className={"dial-button dial-submit-button"} disabled={disabled}
              onClick={triggerConfirmAnswer}>Conferma
      </button>
    </div>
  );
};
