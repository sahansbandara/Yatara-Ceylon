/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../ContactForm';

// Mock fetch
const mockFetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
) as jest.Mock;

global.fetch = mockFetch;

// Mock useRouter
const mockRefresh = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: mockRefresh,
        push: mockPush,
    }),
}));

describe('ContactForm', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockRefresh.mockClear();
        global.alert = jest.fn();
    });

    it('renders all form fields', () => {
        render(<ContactForm />);
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Subject')).toBeInTheDocument();
        expect(screen.getByText('Message', { selector: 'label' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Bespoke Honeymoon Planning')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Share the details of your dream getaway...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument();
    });

    it('submits the form with provided data', async () => {
        render(<ContactForm />);

        fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Bespoke Honeymoon Planning'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText('Share the details of your dream getaway...'), { target: { value: 'Test Message' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/public/tickets', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                customerName: 'Test User',
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test Message',
                priority: 'MEDIUM',
                turnstileToken: 'dev-turnstile-bypass-token',
            }),
        }));
    });

    it('shows success alert and resets form on successful submit', async () => {
        render(<ContactForm />);

        fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Bespoke Honeymoon Planning'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText('Share the details of your dream getaway...'), { target: { value: 'Test Message' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(
                'Message sent successfully! Your ticket ID has been created.'
            );
        });

        // Form should be reset
        expect(screen.getByPlaceholderText('Your Name')).toHaveValue('');
        expect(screen.getByPlaceholderText('name@example.com')).toHaveValue('');
    });

    it('shows error alert when API returns non-ok response', async () => {
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Server error' }) })
        );

        render(<ContactForm />);

        fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'a@b.com' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Bespoke Honeymoon Planning'), { target: { value: 'Sub' } });
        fireEvent.change(screen.getByPlaceholderText('Share the details of your dream getaway...'), { target: { value: 'Msg' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Failed to send message. Please try again.');
        });
    });

    it('shows error alert on network failure', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        render(<ContactForm />);

        fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'a@b.com' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Bespoke Honeymoon Planning'), { target: { value: 'Sub' } });
        fireEvent.change(screen.getByPlaceholderText('Share the details of your dream getaway...'), { target: { value: 'Msg' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('An error occurred.');
        });

        errorSpy.mockRestore();
    });
});
