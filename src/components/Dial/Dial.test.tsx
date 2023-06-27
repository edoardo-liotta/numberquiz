import React from 'react';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import Dial from './Dial';
import * as serviceApi from '../../api/service-api'
import {ApiResponse} from '../../api/service-api'

describe('Dial component', () => {
    beforeEach(() => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return new Promise<ApiResponse>((resolve) => {
                console.log('mocked sendAnswer')
                resolve({status: 200});
            });
        });
    });

    it('should render with initial value 0', () => {
        const {getByText} = render(<Dial text={"Header text"} footerText={"Footer text"} />);
        const valueElement = getByText('0');
        expect(valueElement).toBeInTheDocument();
        const headerElement = getByText('Header text');
        expect(headerElement).toBeInTheDocument();
        const footerElement = getByText('Footer text');
        expect(footerElement).toBeInTheDocument();
    });

    it('should render disabled buttons when instructed to do so', () => {
        const {getByText} = render(<Dial isDisabled={true} text={"Header text"} footerText={"Footer text"} />);

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

    it.skip('should send the value to the server when the submit button is clicked', () => {
        const {getByText} = render(<Dial />);
        const addButton = getByText('+');
        const submitButton = getByText('Conferma');

        fireEvent.click(addButton);
        fireEvent.click(submitButton);

        expect(serviceApi.sendAnswer).toHaveBeenCalledWith(1);
    });

    it.skip('should restore the submit button if something occurred when sending data', async () => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return Promise.reject()
        });

        const component = render(<Dial />);
        const addButton = component.getByText('+');
        const submitButton = component.getByText('Conferma');

        await waitFor(() => act(() => {
                fireEvent.click(addButton);
                fireEvent.click(submitButton);
            })
        );

        expect(addButton).not.toBeDisabled();
    });
});
