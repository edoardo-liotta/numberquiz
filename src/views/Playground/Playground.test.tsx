import * as serviceApi from "../../api/service-api";
import {ApiResponse} from "../../api/service-api";
import {act, fireEvent, render} from "@testing-library/react";
import React from "react";
import Playground from "./Playground";

describe('Playground view', () => {
    beforeEach(() => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return new Promise<ApiResponse>((resolve) => {
                console.log('mocked sendAnswer')
                resolve({status: 200});
            });
        });
    });

    it('should send the value to the server when the submit button is clicked', () => {
        const {getByText} = render(<Playground />);
        const addButton = getByText('+');
        const submitButton = getByText('Conferma');

        fireEvent.click(addButton);
        fireEvent.click(submitButton);

        expect(serviceApi.sendAnswer).toHaveBeenCalledWith(1);
    });

    it('should restore the submit button if something occurred when sending data', async () => {
        jest.spyOn(serviceApi, 'sendAnswer').mockImplementation(() => {
            return Promise.reject()
        });

        const component = render(<Playground />);
        const addButton = component.getByText('+');
        const submitButton = component.getByText('Conferma');

        await act(() => {
            fireEvent.click(addButton);
            fireEvent.click(submitButton);
        })

        expect(addButton).not.toBeDisabled();
    });
});