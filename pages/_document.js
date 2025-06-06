import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Additional head elements for SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />

                {/* Structured Data for Fitness Tool */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "Interval Training Timer",
                            "description": "Free customizable interval training timer for HIIT, Tabata, and fitness workouts",
                            "url": "https://onlinetimerpro.com",
                            "applicationCategory": "HealthApplication",
                            "operatingSystem": "Any",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "author": {
                                "@type": "Organization",
                                "name": "OnlineTimerPro"
                            }
                        })
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}