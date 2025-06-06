// components/Footer.js
import Link from 'next/link';
import styles from '../styles/index.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <p>&copy; {currentYear} Online Timer Pro. Free interval training timer for fitness enthusiasts.</p>
            <div className={styles.footerLinks}>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
            </div>
            <div className={styles.footerInfo}>
                <p>Perfect for HIIT, Tabata, Circuit Training & Pomodoro Technique</p>
            </div>
        </footer>
    );
};

export default Footer;