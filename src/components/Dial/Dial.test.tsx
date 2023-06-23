import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Dial from './Dial';

describe('Dial component', () => {
    it('should render with initial value 0', () => {
        const { getByText } = render(<Dial text={"Header text"} footerText={"Footer text"}/>);
        const valueElement = getByText('0');
        expect(valueElement).toBeInTheDocument();
        const headerElement = getByText('Header text');
        expect(headerElement).toBeInTheDocument();
        const footerElement = getByText('Footer text');
        expect(footerElement).toBeInTheDocument();
    });

    it('should increment value when the + button is clicked', () => {
        const { getByText } = render(<Dial />);
        const addButton = getByText('+');
        fireEvent.click(addButton);
        const valueElement = getByText('1');
        expect(valueElement).toBeInTheDocument();
    });

    it('should decrement value when the - button is clicked', () => {
        const { getByText } = render(<Dial />);
        const addButton = getByText('+');
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        const subtractButton = getByText('-');
        fireEvent.click(subtractButton);
        const valueElement = getByText('1');
        expect(valueElement).toBeInTheDocument();
    });

    it('should not decrement value below 0', () => {
        const { getByText } = render(<Dial />);
        const subtractButton = getByText('-');
        fireEvent.click(subtractButton);
        const valueElement = getByText('0');
        expect(valueElement).toBeInTheDocument();
    });

    it('should toggle disabling of + and - buttons when the submit button is clicked', () => {
        const { getByText } = render(<Dial />);
        const submitButton = getByText('Conferma');
        const addButton = getByText('+');
        const subtractButton = getByText('-');

        fireEvent.click(submitButton);
        expect(addButton).toBeDisabled();
        expect(subtractButton).toBeDisabled();

        fireEvent.click(submitButton);
        expect(addButton).not.toBeDisabled();
        expect(subtractButton).not.toBeDisabled();
    });

});
