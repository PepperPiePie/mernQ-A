import React from 'react';
import App from './App';
import {render, waitForElement} from 'react-testing-library';

it('renders after resolving get promise', () => {
  waitForElement(() => {
    getByTestId('container')
  })
});


it('renders App with header text', () => {
  // waiting for resolving get and rendering container
  waitForElement(() => {
    getByTestId('container');

    //checking for main thing
    const {getByText} = render(<App/>);
    expect(getByText(/Q & A/i)).toBeInTheDocument();
  });
});


it('renders Question with text and labels', () => {
  // waiting for resolving get and rendering container
  waitForElement(() => {
    getByTestId('container');

    //checking for main thing
    const comp =
        <Router>
          <Question />
        </Router>;
    const {getByText} = render(comp);
    expect(getByText(/Author:/i)).toBeInTheDocument();
  });
});
