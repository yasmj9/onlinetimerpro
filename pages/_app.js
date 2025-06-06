import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'


// Google Analytics (optional)
function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
                    crossOrigin="anonymous"
                />

                {/* Favicon and PWA */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#667eea" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp