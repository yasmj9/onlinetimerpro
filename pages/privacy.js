// pages/privacy.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Privacy policy for our free timer application. We respect your privacy and don't collect personal data."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>Privacy Policy</h1>

                    <section>
                        <h2>Our Commitment to Privacy</h2>
                        <p>
                            We are committed to protecting your privacy. This timer application is designed
                            with privacy as a core principle. We believe that your personal information and
                            usage patterns should remain private and under your control.
                        </p>
                    </section>

                    <section>
                        <h2>Information We Don't Collect</h2>
                        <p>
                            <strong>We do not collect, store, or transmit any personal information.</strong>
                            This includes:
                        </p>
                        <ul>
                            <li>No user accounts or registration required</li>
                            <li>No personal identification information</li>
                            <li>No email addresses or contact information</li>
                            <li>No workout data or timer settings</li>
                            <li>No location or device information</li>
                            <li>No usage analytics or tracking</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Local Storage</h2>
                        <p>
                            All timer settings and preferences are stored locally on your device using
                            your browser's local storage. This data never leaves your device and is not
                            accessible to us or any third parties. You can clear this data at any time
                            through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2>Cookies</h2>
                        <p>
                            We do not use cookies to track users or collect personal information. Any
                            cookies that may be present are strictly functional and necessary for the
                            application to work properly (such as maintaining your timer settings during
                            your session).
                        </p>
                    </section>

                    <section>
                        <h2>Third-Party Services</h2>
                        <p>
                            Our timer application may be hosted on third-party platforms (such as Vercel,
                            Netlify, or similar). These platforms may have their own privacy policies
                            regarding basic web analytics (such as page views and traffic patterns).
                            However, no personally identifiable information is shared with these services.
                        </p>
                    </section>

                    <section>
                        <h2>Audio Files</h2>
                        <p>
                            The timer uses audio files for notifications (such as "Get Ready", "Start Training",
                            and "Rest" cues). These audio files are loaded directly in your browser and no
                            information about your audio usage is collected or transmitted.
                        </p>
                    </section>

                    <section>
                        <h2>Children's Privacy</h2>
                        <p>
                            Our service is appropriate for users of all ages. Since we don't collect any
                            personal information from anyone, we comply with children's privacy protection
                            regulations including COPPA (Children's Online Privacy Protection Act).
                        </p>
                    </section>

                    <section>
                        <h2>Security</h2>
                        <p>
                            Since we don't collect or store personal data, there are no personal data
                            security concerns. The application runs entirely in your browser, and any
                            settings you configure are stored locally on your device.
                        </p>
                    </section>

                    <section>
                        <h2>Your Rights</h2>
                        <p>
                            Since we don't collect personal data, there's no personal data to access,
                            modify, or delete from our servers. You have complete control over any local
                            data through your browser settings. You can:
                        </p>
                        <ul>
                            <li>Clear all local storage data through your browser</li>
                            <li>Use the timer in incognito/private browsing mode</li>
                            <li>Use the application without any data persistence</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy occasionally to reflect any changes to our
                            application or legal requirements. Any changes will be posted on this page.
                            Since we don't collect contact information, we cannot notify users directly
                            of changes.
                        </p>
                    </section>

                    <section>
                        <h2>Contact Information</h2>
                        <p>
                            If you have questions about this privacy policy or our privacy practices,
                            you can contact us through the contact page on this website. We're committed
                            to addressing any privacy concerns you may have.
                        </p>
                    </section>

                    <section>
                        <h2>Effective Date</h2>
                        <p>
                            This privacy policy is effective as of January 1, 2025, and applies to all
                            users of our timer application.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}