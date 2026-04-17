export interface Testimonial {
    name: string;
    country: string;
    quote: string;
    rating: number;
}

export const testimonials: Testimonial[] = [
    {
        name: 'Charlotte & James',
        country: 'United Kingdom',
        quote: 'Yatara didn\'t just plan our honeymoon — they orchestrated a love letter to Sri Lanka. Every detail, from the private tuk-tuk through Galle Fort to sunrise at Sigiriya, was flawless.',
        rating: 5,
    },
    {
        name: 'Marc Delafosse',
        country: 'France',
        quote: 'As someone who has traveled extensively through Asia, I can say the level of personal attention Yatara provides is genuinely rare. Our guide felt like a friend, not a service.',
        rating: 5,
    },
    {
        name: 'Sarah Mitchell',
        country: 'Australia',
        quote: 'We had three children under 10 and Yatara made it effortless. The private vehicle, the curated kid-friendly stops, the concierge checking in daily — it was a dream.',
        rating: 5,
    },
    {
        name: 'Thomas & Anna Weber',
        country: 'Germany',
        quote: 'The fixed-price guarantee gave us peace of mind, and the itinerary exceeded our expectations in every way. We\'re already planning our return.',
        rating: 5,
    },
    {
        name: 'Yuki Tanaka',
        country: 'Japan',
        quote: 'The attention to culinary detail was extraordinary. Every meal was a discovery — from street-side hoppers to private dining at a tea estate. Unforgettable.',
        rating: 5,
    },
];

export interface TrustStat {
    value: number;
    suffix: string;
    label: string;
    isFloat?: boolean;
}

export const trustStats: TrustStat[] = [
    { value: 500, suffix: '+', label: 'Bespoke Journeys Crafted' },
    { value: 4.9, suffix: ' / 5', label: 'Average Guest Rating', isFloat: true },
    { value: 12, suffix: '+', label: 'Years of Excellence' },
];
