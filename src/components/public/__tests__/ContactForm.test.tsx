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
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: jest.fn(),
        push: jest.fn(),
    }),
}));

describe('ContactForm', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        // Mock alert
        global.alert = jest.fn();
    });

    it('renders form fields', () => {
        render(<ContactForm />);
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Subject')).toBeInTheDocument();
        // Use selector to target label specifically
        expect(screen.getByText('Message', { selector: 'label' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    });

    it('submits the form with provided data', async () => {
        render(<ContactForm />);

        // Fill form using placeholders
        fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Inquiry about/i), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText(/How can we help you/i), { target: { value: 'Test Message' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        // Check payload
        expect(mockFetch).toHaveBeenCalledWith('/api/public/tickets', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                customerName: 'Test User',
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test Message',
                priority: 'MEDIUM',
            }),
        }));
    });
});
