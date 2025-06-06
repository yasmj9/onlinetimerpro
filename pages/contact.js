// pages/contact.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact Us - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Get in touch with us about our free timer application. We'd love to hear your feedback and suggestions."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>Contact Us</h1>

                    <section>
                        <h2>We'd Love to Hear From You</h2>
                        <p>
                            Thank you for using our multi-purpose timer application! Your feedback,
                            suggestions, and questions help us improve and create better tools for
                            fitness, meditation, and productivity enthusiasts worldwide.
                        </p>
                    </section>

                    <section>
                        <h2>How to Reach Us</h2>
                        <p>
                            Since we value privacy and don't collect user data, we don't have a
                            built-in contact form. However, you can reach us through the following methods:
                        </p>

                        <div className={styles.benefitGrid}>
                            <div className={styles.benefitCard}>
                                <h3>📧 Email Support</h3>
                                <p>
                                    Send us your questions, feedback, or suggestions at:
                                    <br />
                                    <strong>support@onlinetimerpro.com</strong>
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🐛 Bug Reports</h3>
                                <p>
                                    Found a bug or technical issue? Please include:
                                    <br />
                                    • Your browser and version
                                    <br />
                                    • Steps to reproduce the issue
                                    <br />
                                    • What you expected to happen
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>💡 Feature Requests</h3>
                                <p>
                                    Have ideas for new timer modes or features? We'd love to hear them!
                                    <br />
                                    • Describe your use case
                                    <br />
                                    • Explain how it would help
                                    <br />
                                    • Share any specific requirements
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🤝 Partnerships</h3>
                                <p>
                                    Interested in collaborating or integrating our timer?
                                    <br />
                                    • Fitness instructors
                                    <br />
                                    • Educational institutions
                                    <br />
                                    • Wellness organizations
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>What We Can Help With</h2>
                        <ul>
                            <li><strong>Technical Support:</strong> Issues with timer functionality, audio, or browser compatibility</li>
                            <li><strong>Feature Questions:</strong> How to use specific timer modes or features</li>
                            <li><strong>Accessibility:</strong> Making our timer work better for users with disabilities</li>
                            <li><strong>Integration:</strong> Using our timer in educational or fitness programs</li>
                            <li><strong>Privacy Concerns:</strong> Questions about our privacy practices</li>
                            <li><strong>General Feedback:</strong> Your thoughts on improving the user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Response Times</h2>
                        <p>
                            We typically respond to emails within 24-48 hours during business days.
                            For urgent technical issues, please include "URGENT" in your subject line
                            and we'll prioritize your message.
                        </p>
                    </section>

                    <section>
                        <h2>Contributing to Our Mission</h2>
                        <p>
                            Our goal is to provide free, accessible tools that help people improve
                            their fitness, mindfulness, and productivity. If you have expertise in
                            any of these areas and would like to contribute content, advice, or
                            guidance, we'd love to collaborate.
                        </p>
                    </section>

                    <section>
                        <h2>Community Guidelines</h2>
                        <p>
                            When contacting us, please:
                        </p>
                        <ul>
                            <li>Be respectful and constructive in your communication</li>
                            <li>Provide specific details when reporting issues</li>
                            <li>Understand that we're a small team focused on quality</li>
                            <li>Be patient as we work to address your concerns</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Thank You</h2>
                        <p>
                            Thank you for being part of our community and for helping us create
                            better tools for health, wellness, and productivity. Every message
                            helps us understand how to serve our users better.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}