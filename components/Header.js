// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

const Header = () => {
    const router = useRouter();

    const isActivePage = (pathname) => {
        return router.pathname === pathname;
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    Online Timer Pro
                </Link>
                <div className={styles.navLinks}>
                    <Link
                        href="/"
                        className={isActivePage('/') ? styles.activeNavLink : ''}
                    >
                        Home
                    </Link>
                    <Link href="/blog" className={router.pathname.startsWith('/blog') ? styles.activeNavLink : ''}>
                        Blog
                    </Link>
                    <Link
                        href="/about"
                        className={isActivePage('/about') ? styles.activeNavLink : ''}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className={isActivePage('/contact') ? styles.activeNavLink : ''}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/privacy"
                        className={isActivePage('/privacy') ? styles.activeNavLink : ''}
                    >
                        Privacy
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;