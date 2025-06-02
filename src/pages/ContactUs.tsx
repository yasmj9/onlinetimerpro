import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you'd send this to your backend
    console.log('Contact form submitted:', formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Send us an email anytime',
      contact: 'hello@onlinetimerpro.com',
      color: 'blue'
    },
    {
      icon: '🛠️',
      title: 'Technical Support',
      description: 'Get help with technical issues',
      contact: 'support@onlinetimerpro.com',
      color: 'green'
    },
    {
      icon: '💼',
      title: 'Business Inquiries',
      description: 'Partnership and business opportunities',
      contact: 'business@onlinetimerpro.com',
      color: 'purple'
    }
  ];

  const faqItems = [
    {
      question: 'Is Online Timer Pro really free to use?',
      answer: 'Yes! Online Timer Pro is completely free and always will be. We\'re supported by non-intrusive advertisements.'
    },
    {
      question: 'Can I use Online Timer Pro offline?',
      answer: 'Yes, Online Timer Pro is a Progressive Web App (PWA) that works offline once you\'ve visited it online.'
    },
    {
      question: 'Is my data stored on your servers?',
      answer: 'No, all your timer presets and settings are stored locally in your browser. We don\'t collect or store your personal data.'
    },
    {
      question: 'Can I install Online Timer Pro on my device?',
      answer: 'Yes! You can install Online Timer Pro as a PWA on your phone, tablet, or computer for a native app-like experience.'
    }
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-green-200 dark:border-green-800">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
            Thank You!
          </h2>
          <p className="text-green-700 dark:text-green-300 text-lg mb-6">
            Your message has been received successfully. We'll get back to you as soon as possible!
          </p>
          <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4 inline-block">
            <p className="text-sm text-green-600 dark:text-green-400">
              📧 Confirmation sent to: <strong>{formData.email}</strong>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We'd love to hear from you! Whether you have questions, feedback, 
          or suggestions for improving Online Timer Pro, don't hesitate to reach out.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Methods */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Contact Methods
          </h2>
          <div className="space-y-4 mb-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{method.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {method.description}
                    </p>
                    <a 
                      href={`mailto:${method.contact}`}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      {method.contact}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Response Time */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ⏱️ Response Time
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              We typically respond within 24 hours during business days. 
              For urgent technical issues, we aim to respond within 4 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 dark:bg-black/20 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 dark:bg-black/20 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 dark:bg-black/20 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer transition-all ${
                    errors.subject 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select a subject</option>
                  <option value="bug-report">🐛 Bug Report</option>
                  <option value="feature-request">💡 Feature Request</option>
                  <option value="general-feedback">💬 General Feedback</option>
                  <option value="technical-support">🛠️ Technical Support</option>
                  <option value="partnership">🤝 Partnership/Business</option>
                  <option value="press-inquiry">📰 Press Inquiry</option>
                  <option value="other">📝 Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 bg-white/10 dark:bg-black/20 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-vertical transition-all ${
                    errors.message 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Send Message 🚀
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg p-6 border border-white/20 dark:border-white/10"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">
            Need Immediate Help?
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-2xl mx-auto">
            Check out our knowledge base or browse common solutions before reaching out. 
            Many questions can be answered instantly!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
              📚 Knowledge Base
            </button>
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer">
              🔧 Troubleshooting
            </button>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
              💡 Tips & Tricks
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};