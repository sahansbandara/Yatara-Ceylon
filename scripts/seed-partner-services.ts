import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Partner from '../src/models/Partner';
import PartnerService from '../src/models/PartnerService';
import { PartnerTypes, PartnerServiceUnits } from '../src/lib/constants';

dotenv.config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env' });
}

async function seedPartnerServices() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI environment variable is missing.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const partners = await Partner.find({ isDeleted: { $ne: true } });
        console.log(`Found ${partners.length} partners.`);

        let createdCount = 0;

        for (const partner of partners) {
            const existingServices = await PartnerService.find({ partnerId: partner._id, isDeleted: { $ne: true } });
            
            if (existingServices.length > 0) {
                console.log(`Partner ${partner.name} already has ${existingServices.length} services. Skipping.`);
                continue;
            }

            const servicesToCreate = [];

            switch (partner.type) {
                case PartnerTypes.GUIDE:
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Full Day Guiding',
                        rate: 15000,
                        unit: PartnerServiceUnits.PER_DAY,
                        description: 'Professional guiding service for a full day.',
                    });
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Half Day Guiding',
                        rate: 8000,
                        unit: PartnerServiceUnits.PER_DAY,
                        description: 'Professional guiding service for half a day.',
                    });
                    break;
                case PartnerTypes.HOTEL:
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Standard Double Room',
                        rate: 25000,
                        unit: PartnerServiceUnits.PER_NIGHT,
                        description: 'Standard double room with breakfast included.',
                    });
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Family Suite',
                        rate: 45000,
                        unit: PartnerServiceUnits.PER_NIGHT,
                        description: 'Family suite suitable for 4 people with breakfast.',
                    });
                    break;
                case PartnerTypes.DRIVER:
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Airport Pickup',
                        rate: 12000,
                        unit: PartnerServiceUnits.PER_TRIP,
                        description: 'One-way transfer from the airport to the hotel.',
                    });
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Full Day Driving',
                        rate: 18000,
                        unit: PartnerServiceUnits.PER_DAY,
                        description: 'Full day driving service (up to 10 hours/100km).',
                    });
                    break;
                case PartnerTypes.RESTAURANT:
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Set Menu Lunch',
                        rate: 4500,
                        unit: PartnerServiceUnits.PER_PERSON,
                        description: 'Standard Sri Lankan rice and curry set menu.',
                    });
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'Buffet Dinner',
                        rate: 6500,
                        unit: PartnerServiceUnits.PER_PERSON,
                        description: 'International and local buffet dinner.',
                    });
                    break;
                default:
                    servicesToCreate.push({
                        partnerId: partner._id,
                        serviceName: 'General Service',
                        rate: 10000,
                        unit: PartnerServiceUnits.FLAT,
                        description: 'Standard service fee.',
                    });
                    break;
            }

            for (const serviceData of servicesToCreate) {
                await PartnerService.create(serviceData);
                createdCount++;
            }
            console.log(`Created ${servicesToCreate.length} services for ${partner.name}.`);
        }

        console.log(`\n🎉 Success! Created a total of ${createdCount} partner services.`);

    } catch (error) {
        console.error('❌ Error seeding partner services:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedPartnerServices();
