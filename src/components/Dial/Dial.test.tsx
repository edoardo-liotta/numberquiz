import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import Dial from './Dial';

describe('Dial component', () => {
    it('should render with initial value 0', () => {
        const {getByText} = render(<Dial text={"Header text"} />);
        const valueElement = getByText('0');
        expect(valueElement).toBeInTheDocument();
        const headerElement = getByText('Header text');
        expect(headerElement).toBeInTheDocument();
    });

    it('should render disabled buttons when instructed to do so', () => {
        const {getByText} = render(<Dial isDisabled={true} text={"Header text"}/>);

        const addButton = getByText('+');
        const subtractButton = getByText('-');
        const submitButton = getByText('Conferma');
        expect(addButton).toBeDisabled();
        expect(subtractButton).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('should increment value when the + button is clicked', () => {
        const {getByText} = render(<Dial />);
        const addButton = getByText('+');
        fireEvent.click(addButton);
        const valueElement = getByText('1');
        expect(valueElement).toBeInTheDocument();
    });

    it('should decrement value when the - button is clicked', () => {
        const {getByText} = render(<Dial />);
        const addButton = getByText('+');
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        const subtractButton = getByText('-');
        fireEvent.click(subtractButton);
        const valueElement = getByText('1');
        expect(valueElement).toBeInTheDocument();
    });

    it('should not decrement value below 0', () => {
        const {getByText} = render(<Dial />);
        const subtractButton = getByText('-');
        fireEvent.click(subtractButton);
        const valueElement = getByText('0');
        expect(valueElement).toBeInTheDocument();
    });

    it('should trigger the callback function when submit button is clicked', () => {
        const mockCallback = jest.fn();
        const {getByText} = render(<Dial onConfirmAnswer={mockCallback} />);
        const addButton = getByText('+');
        const submitButton = getByText('Conferma');

        fireEvent.click(addButton);
        fireEvent.click(submitButton);
        expect(mockCallback).toHaveBeenCalledWith({value: 1});
    });
});
