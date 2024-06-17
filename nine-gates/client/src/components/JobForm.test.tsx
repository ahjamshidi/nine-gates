import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobForm from '../components/JobForm';
import { searchOccupationsByTitle } from '../helpers/api';

jest.mock('../helpers/api', () => ({
  searchOccupationsByTitle: jest.fn(),
}));
const mockSearchOccupationsByTitle = searchOccupationsByTitle as jest.Mock;

describe('JobForm', () => {
  const formSubmitHandler = jest.fn();
  beforeEach(() => {
    mockSearchOccupationsByTitle.mockClear();
    formSubmitHandler.mockClear();
  });
  test('renders the form with all fields and submit button', () => {
    render(<JobForm formSubmitHandler={formSubmitHandler} />);

    expect(screen.getByLabelText(/current job/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/desired job/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /search skills/i })
    ).toBeInTheDocument();
  });

  test('allows user to enter current job and desired job', async () => {
    render(<JobForm formSubmitHandler={formSubmitHandler} />);
    const currentJobInput = screen.getByLabelText(/current job/i);
    const desiredJobInput = screen.getByLabelText(/desired job/i);
    // Mock API response
    mockSearchOccupationsByTitle.mockResolvedValue([
      'Software Engineer',
      'Product Manager',
    ]);
    // Simulate user typing in current job input
    fireEvent.change(currentJobInput, { target: { value: 'Software' } });
    fireEvent.input(currentJobInput, { target: { value: 'Software' } });
    await waitFor(() => {
      expect(mockSearchOccupationsByTitle).toHaveBeenCalledWith('Software');
    });
    // Simulate user selecting an option from autocomplete
    fireEvent.change(currentJobInput, {
      target: { value: 'Software Engineer' },
    });
    expect(currentJobInput).toHaveValue('Software Engineer');

    // Simulate user typing in desired job input
    fireEvent.change(desiredJobInput, { target: { value: 'Manager' } });
    fireEvent.input(desiredJobInput, { target: { value: 'Manager' } });

    await waitFor(() => {
      expect(mockSearchOccupationsByTitle).toHaveBeenCalledWith('Manager');
    });

    // Simulate user selecting an option from autocomplete
    fireEvent.change(desiredJobInput, { target: { value: 'Product Manager' } });
    expect(desiredJobInput).toHaveValue('Product Manager');
  });

  test('submits the form with current job and desired job', async () => {
    render(<JobForm formSubmitHandler={formSubmitHandler} />);

    const currentJobInput = screen.getByLabelText(/current job/i);
    const desiredJobInput = screen.getByLabelText(/desired job/i);
    const submitButton = screen.getByRole('button', { name: /search skills/i });

    // Simulate user entering values
    fireEvent.change(currentJobInput, {
      target: { value: 'Software Engineer' },
    });
    fireEvent.change(desiredJobInput, { target: { value: 'Product Manager' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    expect(formSubmitHandler).toHaveBeenCalledWith(
      'Software Engineer',
      'Product Manager'
    );
  });
});
