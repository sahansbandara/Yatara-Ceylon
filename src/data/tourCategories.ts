export interface TourCategory {
    title: string;
    description: string;
    image: string;
    href: string;
}

export const tourCategories: TourCategory[] = [
    {
        title: 'HERITAGE TOURS',
        description: 'Walk through 3,000 years of living history — ancient kingdoms, sacred temples, and colonial grandeur.',
        image: '/images/home/cat-heritage.png',
        href: '/packages?tag=heritage',
    },
    {
        title: 'WILDLIFE SAFARI',
        description: 'Track leopards in Yala, spot elephants in Udawalawe, and discover Sri Lanka\'s untamed heart.',
        image: '/images/home/cat-wildlife.png',
        href: '/packages?tag=wildlife',
    },
    {
        title: 'HONEYMOON TOURS',
        description: 'Romantic escapes designed for two — sunset beaches, private villas, and intimate dining.',
        image: '/images/home/cat-honeymoon.png',
        href: '/packages?tag=honeymoon',
    },
    {
        title: 'AYURVEDIC RETREATS',
        description: 'Ancient wellness traditions in serene tropical settings — restore body, mind, and spirit.',
        image: '/images/home/cat-ayurvedic.png',
        href: '/packages?tag=wellness',
    },
    {
        title: 'HILL COUNTRY',
        description: 'Misty tea plantations, scenic train rides, and cool mountain air in Sri Lanka\'s highlands.',
        image: '/images/home/cat-hillcountry.png',
        href: '/packages?tag=hillcountry',
    },
    {
        title: 'COASTAL ESCAPES',
        description: 'From Mirissa\'s whale-watching shores to Trincomalee\'s turquoise waters — ocean bliss awaits.',
        image: '/images/home/cat-coastal.png',
        href: '/packages?tag=beach',
    },
];
