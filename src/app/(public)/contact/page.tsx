import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import ContactForm from '@/components/public/ContactForm';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us | Ceylon Escapes',
    description: 'Get in touch with our team for inquiries, bookings, and support.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <SectionHeading
                        title="Get in Touch"
                        subtitle="Contact Us"
                        description="We're here to help you plan your perfect Sri Lankan getaway."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Our Office</h4>
                                        <p className="text-gray-600">
                                            123 Tourism Road,<br />
                                            Colombo 03,<br />
                                            Sri Lanka
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone & WhatsApp</h4>
                                        <p className="text-gray-600">+94 77 123 4567</p>
                                        <p className="text-gray-600">+94 11 234 5678</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email</h4>
                                        <p className="text-gray-600">hello@ceylonescapes.com</p>
                                        <p className="text-gray-600">support@ceylonescapes.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 shrink-0">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Business Hours</h4>
                                        <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                        <p className="text-gray-600">Sat: 9:00 AM - 1:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h3>
                            <div className="flex gap-4">
                                <Link href="#" className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-ocean-600 hover:text-white hover:border-ocean-600 transition-all">
                                    <Facebook className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-ocean-600 hover:text-white hover:border-ocean-600 transition-all">
                                    <Instagram className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-ocean-600 hover:text-white hover:border-ocean-600 transition-all">
                                    <Twitter className="h-6 w-6" />
                                </Link>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 relative">
                            {/* iframe embed for Google Maps would go here */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                                Google Map Embed
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
