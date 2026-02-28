import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Yatara Ceylon | Discover Sri Lanka',
        template: '%s | Yatara Ceylon',
    },
    description:
        'Experience the magic of Sri Lanka with Yatara Ceylon. From ancient temples to pristine beaches, lush tea plantations to thrilling wildlife safaris. Book your dream vacation today.',
    keywords: [
        'Sri Lanka tours',
        'Ceylon travel',
        'Sri Lanka holidays',
        'Sigiriya',
        'Kandy',
        'Galle',
        'wildlife safari',
        'tea plantations',
        'custom tour builder',
        'Yatara Ceylon',
    ],
    openGraph: {
        title: 'Yatara Ceylon | Discover Sri Lanka',
        description: 'Experience the magic of Sri Lanka with Yatara Ceylon.',
        type: 'website',
        locale: 'en_US',
        siteName: 'Yatara Ceylon',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-background font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
