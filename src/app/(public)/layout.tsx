import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Tawk.to Live Chat Widget */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                            s1.async=true;
                            s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID || 'default'}/${process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID || 'default'}';
                            s1.charset='UTF-8';
                            s1.setAttribute('crossorigin','*');
                            s0.parentNode.insertBefore(s1,s0);
                        })();
                    `,
                }}
            />
        </div>
    );
}
