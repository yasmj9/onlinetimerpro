import { motion } from 'framer-motion';

export const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            VClock is committed to protecting your privacy. We collect minimal information to provide our timer services:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Timer preferences and settings (stored locally on your device)</li>
            <li>Usage analytics to improve our service</li>
            <li>Technical information such as browser type and operating system</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our timer services</li>
            <li>Improve user experience and app functionality</li>
            <li>Analyze usage patterns to enhance features</li>
            <li>Display relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Local Storage</h2>
          <p className="mb-4">
            Your timer presets, settings, and preferences are stored locally in your browser. 
            This data never leaves your device and is not transmitted to our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Google AdSense</h2>
          <p className="mb-4">
            We use Google AdSense to display advertisements. Google may use cookies and other 
            tracking technologies to serve personalized ads based on your browsing behavior.
          </p>
          <p className="mb-4">
            For more information about Google's privacy practices, please visit: 
            <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
              Google Privacy Policy
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remembering your preferences and settings</li>
            <li>Analytics and performance monitoring</li>
            <li>Advertising through Google AdSense</li>
          </ul>
          <p className="mb-4">
            You can control cookies through your browser settings. Note that disabling 
            cookies may affect the functionality of our application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
          <p className="mb-4">Our app integrates with the following third-party services:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Google Analytics:</strong> For usage analytics (if implemented)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information. 
            Since most data is stored locally on your device, you maintain control over your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our service is not directed to children under 13. We do not knowingly collect 
            personal information from children under 13. If you become aware that a child 
            has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: privacy@vclock.app<br />
            Website: https://vclock.app
          </p>
        </section>
      </div>
    </motion.div>
  );
};
