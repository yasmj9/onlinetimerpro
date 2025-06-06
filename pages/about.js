// pages/about.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function About() {
    return (
        <>
            <Head>
                <title>About Us - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Learn about our mission to provide free, accessible timer tools for fitness, meditation, and productivity. Discover why we created this application."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>About Our Multi-Purpose Timer</h1>

                    <section>
                        <h2>Our Mission</h2>
                        <p>
                            We believe that effective tools for health, wellness, and productivity should be
                            accessible to everyone, regardless of budget or technical expertise. Our multi-purpose
                            timer was created to eliminate barriers between you and your goals by providing
                            professional-grade timing tools that are completely free and easy to use.
                        </p>
                    </section>

                    <section>
                        <h2>Why We Built This Application</h2>
                        <p>
                            Traditional timing solutions often require expensive equipment, gym memberships,
                            or complicated apps with subscription fees. We recognized that many people were
                            using basic stopwatches or phone timers, which lack the specific features needed
                            for effective interval training, meditation practice, and focused work sessions.
                        </p>
                        <p>
                            Our timer bridges this gap by offering three specialized modes with customizable
                            settings, clear visual cues, audio notifications, and progress tracking - all the
                            features you need for successful HIIT workouts, peaceful meditation sessions,
                            and productive work using the Pomodoro technique.
                        </p>
                    </section>

                    <section>
                        <h2>Built for Everyone</h2>
                        <div className={styles.benefitGrid}>
                            <div className={styles.benefitCard}>
                                <h3>💪 Fitness Enthusiasts</h3>
                                <p>
                                    Whether you're a beginner starting your first HIIT routine or an experienced
                                    athlete training for competition, our interval timer adapts to your needs with
                                    customizable work/rest periods and audio coaching.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🧘 Mindfulness Practitioners</h3>
                                <p>
                                    From quick 5-minute breathing exercises to extended meditation sessions, our
                                    peaceful interface provides gentle guidance without distractions, helping you
                                    develop a consistent practice.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>📚 Productivity Seekers</h3>
                                <p>
                                    Students, professionals, and anyone looking to improve focus can benefit from
                                    our Pomodoro timer, designed to help you work in focused sprints with proper
                                    break management.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🏫 Educators & Trainers</h3>
                                <p>
                                    Teachers, fitness instructors, and wellness coaches can integrate our timer
                                    into their programs, providing students and clients with a reliable timing
                                    solution.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>Technology & Performance</h2>
                        <p>
                            Built with Next.js and React, our timer leverages modern web technologies to
                            deliver a fast, reliable experience across all devices. The application works
                            offline once loaded, requires no registration or personal data collection, and
                            runs efficiently on phones, tablets, and computers.
                        </p>
                        <p>
                            We've optimized every aspect of the user experience, from the intuitive interface
                            design to the precise timing algorithms, ensuring that our timer performs
                            consistently whether you're doing a quick workout or a long study session.
                        </p>
                    </section>

                    <section>
                        <h2>Privacy-First Design</h2>
                        <p>
                            Your privacy is paramount to us. Our timer operates entirely in your browser,
                            storing preferences locally on your device. We don't collect personal data,
                            require accounts, or track your usage patterns. You have complete control over
                            your information and can use our timer with confidence.
                        </p>
                    </section>

                    <section>
                        <h2>Community Impact</h2>
                        <p>
                            Since launching, thousands of users have completed millions of training intervals,
                            meditation sessions, and focused work periods using our timer. We're proud to
                            support the wellness and productivity journeys of people worldwide, from students
                            using it for study sessions to professional trainers incorporating it into their
                            programs.
                        </p>
                    </section>

                    <section>
                        <h2>Continuous Improvement</h2>
                        <p>
                            We regularly update our timer based on user feedback and the latest research in
                            interval training methodologies, meditation practices, and productivity techniques.
                            Our goal is to remain the most useful and user-friendly multi-purpose timer
                            available online.
                        </p>
                        <p>
                            Every feature we add is carefully considered to ensure it enhances the user
                            experience without adding unnecessary complexity. We believe in doing a few
                            things exceptionally well rather than trying to be everything to everyone.
                        </p>
                    </section>

                    <section>
                        <h2>Looking Forward</h2>
                        <p>
                            As we continue to grow, we remain committed to our core values: accessibility,
                            privacy, and excellence. We're exploring new ways to help people achieve their
                            health and productivity goals while maintaining our commitment to providing free,
                            high-quality tools for everyone.
                        </p>
                    </section>

                    <section>
                        <h2>Get Involved</h2>
                        <p>
                            We'd love to hear from you! Whether you have feedback, suggestions, or just want
                            to share how our timer has helped you, please don't hesitate to reach out through
                            our contact page. Your input helps us create better tools for our entire community.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}