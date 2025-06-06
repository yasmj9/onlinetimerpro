import Header from './Header';
import Footer from './Footer';
import AdSenseBanner from './AdSenseBanner'; // Import our new component
import styles from '../styles/index.module.css';

// The Layout component now accepts a "showSidebar" prop
const Layout = ({ children, showSidebar = false }) => {
    return (
        <div className={styles.container}>
            <Header />
            {/* New wrapper for main content and sidebar */}
            <div className={styles.contentWrapper}>
                <main className={showSidebar ? styles.mainWithSidebar : styles.main}>
                    {children}
                </main>

                {/* The sidebar will only be rendered if showSidebar is true */}
                {showSidebar && (
                    <aside className={styles.sidebar}>
                        <h4>Advertisement</h4>
                        <AdSenseBanner
                            // IMPORTANT: Replace with your actual Publisher and Slot IDs
                            // This should be a "Vertical" or "Rectangle" ad unit from your AdSense account
                            client="ca-pub-XXXXXXXXXX"
                            slot="YOUR_SIDEBAR_AD_SLOT_ID"
                            format="auto"
                        />
                    </aside>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;