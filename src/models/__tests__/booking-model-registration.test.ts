import mongoose from 'mongoose';

describe('Booking model registration', () => {
    it('registers referenced models needed for populate on cold starts', async () => {
        await import('../Booking');

        expect(mongoose.models.Booking).toBeDefined();
        expect(mongoose.models.Package).toBeDefined();
        expect(mongoose.models.User).toBeDefined();
        expect(mongoose.models.Vehicle).toBeDefined();
        expect(mongoose.models.CustomPlan).toBeDefined();
    });
});
