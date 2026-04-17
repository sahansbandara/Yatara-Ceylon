/**
 * @jest-environment node
 */
import { PATCH } from './route';

const mockConnectDB = jest.fn();
const mockInvoiceFindById = jest.fn();
const mockLogAudit = jest.fn();
const mockGetTokenFromRequest = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockConnectDB(...args),
}));

jest.mock('@/models/Invoice', () => ({
    __esModule: true,
    default: {
        findById: (...args: unknown[]) => mockInvoiceFindById(...args),
    },
}));

jest.mock('@/lib/audit', () => ({
    logAudit: (...args: unknown[]) => mockLogAudit(...args),
}));

jest.mock('@/lib/auth', () => ({
    getTokenFromRequest: (...args: unknown[]) => mockGetTokenFromRequest(...args),
    verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

describe('PATCH /api/invoices/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectDB.mockResolvedValue(undefined);
        mockGetTokenFromRequest.mockReturnValue('token');
        mockVerifyToken.mockResolvedValue({
            userId: 'staff-1',
            role: 'STAFF',
            email: 'staff@test.com',
        });
    });

    it('allows the FINAL -> VOID transition and records an audit entry', async () => {
        const save = jest.fn().mockResolvedValue(undefined);
        mockInvoiceFindById.mockResolvedValue({
            _id: 'inv-1',
            status: 'FINAL',
            save,
        });

        const response = await PATCH(
            new Request('http://localhost:3000/api/invoices/inv-1', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: 'toms_token=token; toms_csrf=csrf-token',
                    'x-csrf-token': 'csrf-token',
                },
                body: JSON.stringify({ status: 'VOID', reason: 'Superseded' }),
            }),
            { params: Promise.resolve({ id: 'inv-1' }) }
        );

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(save).toHaveBeenCalled();
        expect(data.message).toBe('Invoice voided successfully');
        expect(mockLogAudit).toHaveBeenCalledWith(
            expect.objectContaining({
                action: 'VOID',
                entity: 'Invoice',
                entityId: 'inv-1',
                meta: expect.objectContaining({
                    status: 'VOID',
                    reason: 'Superseded',
                }),
            })
        );
    });

    it('rejects invalid DRAFT -> VOID transitions', async () => {
        const save = jest.fn().mockResolvedValue(undefined);
        mockInvoiceFindById.mockResolvedValue({
            _id: 'inv-2',
            status: 'DRAFT',
            save,
        });

        const response = await PATCH(
            new Request('http://localhost:3000/api/invoices/inv-2', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: 'toms_token=token; toms_csrf=csrf-token',
                    'x-csrf-token': 'csrf-token',
                },
                body: JSON.stringify({ status: 'VOID' }),
            }),
            { params: Promise.resolve({ id: 'inv-2' }) }
        );

        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid state transition');
        expect(save).not.toHaveBeenCalled();
        expect(mockLogAudit).not.toHaveBeenCalled();
    });
});
