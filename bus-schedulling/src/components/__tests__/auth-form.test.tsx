import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '../auth-form';



describe('AuthForm', () => {
  it('renders login form by default', () => {
    render(<AuthForm />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/phone number/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument();
  });

  it('toggles to signup form', () => {
    render(<AuthForm />);
    // Click the Create Account button in the footer
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit (signup)', async () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    // Click the submit button
    const submitButton = screen.getByRole('button', { name: /^create account$/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email and password', async () => {
    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    // Click the submit button
    const submitButton = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('shows success message on login', async () => {
    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    const submitButton = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it('shows success message on signup', async () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    const submitButton = screen.getByRole('button', { name: /^create account$/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });
  });
});