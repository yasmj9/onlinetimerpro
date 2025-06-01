import { motion } from 'framer-motion';
import { useRouter, PageType } from '../hooks/useRouter';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const footerLinks = [
    { page: 'about' as PageType, label: 'About Us' },
    { page: 'privacy' as PageType, label: 'Privacy Policy' },
    { page: 'terms' as PageType, label: 'Terms of Service' },
    { page: 'contact' as PageType, label: 'Contact Us' }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-16 py-8 border-t border-white/10 dark:border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-3">Online Time Pro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Beautiful, precise timer for productivity and workouts. 
              Free forever, no registration required.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="GitHub"
              >
                👨‍💻
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="Email"
              >
                📧
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>⏰ Digital Clock</li>
              <li>⏲️ Countdown Timer</li>
              <li>🏋️ Training Timer</li>
              <li>🌙 Dark/Light Theme</li>
              <li>📱 Mobile Responsive</li>
              <li>🔔 Sound Alerts</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 dark:border-white/5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Online Timer Pro. All rights reserved. 
            Made with ❤️ for productivity and fitness.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};