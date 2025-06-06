import { useEffect } from 'react';
import styles from '../styles/index.module.css';

const AdSenseBanner = ({
    client = "ca-pub-XXXXXXXXXX", // Your AdSense publisher ID
    slot,                          // The ad slot ID
    format = "auto",               // "auto", "rectangle", "vertical", etc.
    responsive = "true",           // "true" or "false"
    className = ""                 // Optional additional class names
}) => {
    useEffect(() => {
        try {
            // This is the command that tells AdSense to find and fill the ad slot.
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []); // The empty array ensures this effect runs only once after the component mounts

    // Ads will not show on localhost, so we'll render a placeholder in development
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div
                style={{
                    background: '#f0f0f0',
                    color: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '100px',
                    width: '100%',
                    border: '1px dashed #ccc',
                    margin: '10px 0',
                }}
            >
                Ad Placeholder<br />(Visible on live site only)
            </div>
        );
    }

    // This is the actual ad unit that will be rendered on your live site.
    return (
        <div className={`${styles.adContainer} ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-ad-full-width-responsive={responsive}
            ></ins>
        </div>
    );
};

export default AdSenseBanner;