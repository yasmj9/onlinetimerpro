import { motion } from 'framer-motion';

export const TermsOfService: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg shadow-lg"
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            By accessing and using Online Timer Pro ("the Service"), you accept and agree to be bound by the terms 
            and provisions of this agreement. If you do not agree to abide by the terms outlined below, 
            please do not use this service. Your continued use of Online Timer Pro constitutes acceptance of any 
            changes to these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            2. Service Description
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Online Timer Pro is a free web-based timer application designed to enhance productivity and fitness routines. 
            Our service provides:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">⏰ Digital Clock</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Large-format time display with automatic timezone detection and date information
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">⏲️ Countdown Timer</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Precise countdown functionality with visual progress indicators and audio alerts
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🏋️ Training Timer</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Specialized workout timer with customizable work/rest intervals and preset management
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">📱 PWA Support</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Progressive Web App functionality for offline use and device installation
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            3. Acceptable Use Policy
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            You agree to use Online Timer Pro only for lawful purposes and in a manner that does not violate these terms. 
            Prohibited activities include:
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <ul className="space-y-2 text-red-800 dark:text-red-200">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Violating any applicable local, state, national, or international laws</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Attempting to gain unauthorized access to our systems or other users' data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Interfering with or disrupting the proper functioning of the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Using automated tools to access the service excessively or maliciously</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Transmitting viruses, malware, or other harmful code</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            4. Intellectual Property Rights
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            The Online Timer Pro application, including its design, functionality, graphics, interface, and content, 
            is protected by copyright and other intellectual property laws. All rights are reserved.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Note:</strong> You may use Online Timer Pro for personal and commercial timing needs, but you may not 
              copy, modify, distribute, sell, or lease any part of our service or included software.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            5. Disclaimer of Warranties
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Online Timer Pro is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. 
            We do not guarantee that the service will be:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Available at all times</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Free from errors or bugs</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Compatible with all devices</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Suitable for critical timing</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            6. Limitation of Liability
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Under no circumstances shall Online Timer Pro, its developers, or affiliates be liable for any indirect, 
            incidental, special, consequential, or punitive damages, including but not limited to loss of 
            profits, data, use, goodwill, or other intangible losses resulting from your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            7. Privacy and Data Protection
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
            your information when you use Online Timer Pro. By using our service, you agree to the collection and 
            use of information in accordance with our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            8. Third-Party Services and Advertising
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Online Timer Pro displays advertisements through Google AdSense to support our free service. 
            These ads are provided by third parties and we are not responsible for their content 
            or the privacy practices of advertisers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            9. Service Modifications and Termination
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            We reserve the right to modify, suspend, or discontinue Online Timer Pro at any time without prior notice. 
            We may also update these Terms of Service periodically. Continued use of the service after 
            any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            10. Governing Law and Disputes
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with applicable laws. 
            Any disputes arising from these terms or your use of Online Timer Pro shall be resolved through 
            binding arbitration or in the appropriate courts.
          </p>
        </section>

        <section className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            11. Contact Information
          </h2>
          <p className="mb-4 text-blue-800 dark:text-blue-200">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-blue-700 dark:text-blue-300">
            <p><strong>Email:</strong> legal@onlinetimerpro.com</p>
            <p><strong>Support:</strong> support@onlinetimerpro.com</p>
            <p><strong>Website:</strong> https://onlinetimerpro.com</p>
          </div>
        </section>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-6">
          <p>
            By using Online Timer Pro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </motion.div>
  );
};