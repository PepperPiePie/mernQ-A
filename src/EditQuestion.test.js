import React from 'react';
import EditQuestion from './EditQuestion';
import {render, waitForElement} from 'react-testing-library';


it('renders fielset with header legend text', () => {
    // waiting for resolving get and rendering container
    waitForElement(() => {
        getByTestId('container');

        //checking for main thing
        const {getByText} = render(<EditQuestion/>);
        expect(getByText(/Edit question/i)).toBeInTheDocument();
    });
});

it('calls "editQuestion" on submit', () => {
    // waiting for resolving get and rendering container
    waitForElement(() => {
        getByTestId('container');

        //checking for main thing
        const onSubmit = jest.fn();
        fireEvent.click(getByText(/Send update/i)[0]);
        expect(onSubmit).toHaveBeenCalled();
    });
});

