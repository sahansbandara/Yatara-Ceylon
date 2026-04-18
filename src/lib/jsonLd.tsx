// ─────────────────────────────────────────────────────────
// JSON-LD Structured Data — Centralised builder functions
// schema.org types for SEO rich results
// ─────────────────────────────────────────────────────────

import React from 'react';
import { normalizeImageUrl } from '@/lib/image-utils';

const SITE_URL = 'https://yataraceylon.me';
const SITE_NAME = 'Yatara Ceylon';
const LOGO_URL = `${SITE_URL}/images/logo.png`;

/** Return absolute URL for an image — if already absolute, return as-is */
function absImageUrl(src?: string): string | undefined {
    if (!src) return undefined;
    const sanitized = normalizeImageUrl(src);
    if (!sanitized) return undefined;
    if (sanitized.startsWith('http://') || sanitized.startsWith('https://')) return sanitized;
    return `${SITE_URL}${sanitized.startsWith('/') ? '' : '/'}${sanitized}`;
}

/* ═══════════════════════════════════════════════════════════
   Reusable Component
   ═══════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════
   Organization — brand entity (site-wide)
   ═══════════════════════════════════════════════════════════ */

export function buildOrganization() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: LOGO_URL,
        },
        description:
            'Luxury travel experiences across Sri Lanka. Bespoke itineraries, private transfers, and curated journeys crafted with precision.',
        sameAs: [
            'https://www.facebook.com/yataraceylon',
            'https://www.instagram.com/yataraceylon',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['English', 'Sinhala'],
        },
        areaServed: {
            '@type': 'Country',
            name: 'Sri Lanka',
        },
    };
}

/* ═══════════════════════════════════════════════════════════
   WebSite — site-level schema with search action
   ═══════════════════════════════════════════════════════════ */

export function buildWebSite() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/* ═══════════════════════════════════════════════════════════
   TravelAgency — for the transfers landing page
   ═══════════════════════════════════════════════════════════ */

export function buildTravelAgency() {
    return {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        '@id': `${SITE_URL}/#travelagency`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: LOGO_URL,
        description:
            'Premium private transfers and luxury chauffeur services across Sri Lanka. Airport arrivals, intercity routes, safari logistics, and hourly hire.',
        areaServed: {
            '@type': 'Country',
            name: 'Sri Lanka',
        },
        priceRange: 'LKR 8,500 – LKR 85,000',
        currenciesAccepted: 'LKR, USD',
        paymentAccepted: 'Credit Card, Bank Transfer',
    };
}

/* ═══════════════════════════════════════════════════════════
   FAQPage — from FAQ data array
   ═══════════════════════════════════════════════════════════ */

export function buildFAQPage(items: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

/* ═══════════════════════════════════════════════════════════
   Product + Offer — for individual transfer routes
   ═══════════════════════════════════════════════════════════ */

export function buildTransferProduct(transfer: {
    slug: string;
    title: string;
    summary: string;
    startingPriceLkr: number;
    heroImage: string;
    pickupLabel: string;
    dropoffLabel: string;
    duration: string;
    includes: string[];
    seoDescription: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: transfer.title,
        description: transfer.seoDescription,
        image: absImageUrl(transfer.heroImage),
        url: `${SITE_URL}/transfers/${transfer.slug}`,
        brand: {
            '@type': 'Organization',
            name: SITE_NAME,
        },
        offers: {
            '@type': 'Offer',
            price: transfer.startingPriceLkr,
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: SITE_NAME,
            },
            priceValidUntil: new Date(
                new Date().getFullYear(),
                11,
                31
            ).toISOString().split('T')[0],
        },
        additionalProperty: [
            {
                '@type': 'PropertyValue',
                name: 'Pickup',
                value: transfer.pickupLabel,
            },
            {
                '@type': 'PropertyValue',
                name: 'Drop-off',
                value: transfer.dropoffLabel,
            },
            {
                '@type': 'PropertyValue',
                name: 'Duration',
                value: transfer.duration,
            },
        ],
    };
}

/* ═══════════════════════════════════════════════════════════
   TouristDestination — for destination detail pages
   ═══════════════════════════════════════════════════════════ */

export function buildDestinationPlace(destination: {
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    location?: string;
    region?: string;
    images?: string[];
    bestSeason?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: destination.title,
        description: destination.longDescription || destination.description,
        url: `${SITE_URL}/destinations/${destination.slug}`,
        image: absImageUrl(destination.images?.[0]),
        touristType: 'Luxury travellers',
        containedInPlace: {
            '@type': 'Country',
            name: 'Sri Lanka',
        },
        ...(destination.location && {
            address: {
                '@type': 'PostalAddress',
                addressRegion: destination.location,
                addressCountry: 'LK',
            },
        }),
    };
}

/* ═══════════════════════════════════════════════════════════
   TouristTrip + Product — for package detail pages
   ═══════════════════════════════════════════════════════════ */

export function buildTourPackage(pkg: {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    duration?: string;
    priceMin?: number;
    priceMax?: number;
    images?: string[];
    tags?: string[];
    itinerary?: { day: number; title: string }[];
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': ['TouristTrip', 'Product'],
        name: pkg.title,
        description: pkg.summary,
        url: `${SITE_URL}/packages/${pkg.slug}`,
        image: absImageUrl(pkg.images?.[0]),
        provider: {
            '@type': 'TravelAgency',
            name: SITE_NAME,
            url: SITE_URL,
        },
        touristType: 'Luxury travellers',
    };

    if (pkg.duration) {
        schema.duration = pkg.duration;
    }

    if (pkg.itinerary && pkg.itinerary.length > 0) {
        schema.itinerary = {
            '@type': 'ItemList',
            numberOfItems: pkg.itinerary.length,
            itemListElement: pkg.itinerary.map((day) => ({
                '@type': 'ListItem',
                position: day.day,
                name: day.title,
            })),
        };
    }

    if (pkg.priceMin && pkg.priceMax) {
        schema.offers = {
            '@type': 'AggregateOffer',
            lowPrice: pkg.priceMin,
            highPrice: pkg.priceMax,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: SITE_NAME,
            },
        };
    } else if (pkg.priceMin) {
        schema.offers = {
            '@type': 'Offer',
            price: pkg.priceMin,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        };
    }

    return schema;
}

/* ═══════════════════════════════════════════════════════════
   BreadcrumbList — navigation context
   ═══════════════════════════════════════════════════════════ */

export function buildBreadcrumb(
    items: { name: string; url: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}
