import { motion } from 'framer-motion';

export const AboutUs: React.FC = () => {
  const features = [
    {
      icon: '⏰',
      title: 'Digital Clock',
      description: 'Beautiful, large-format time display with automatic timezone detection and date information.',
      color: 'blue'
    },
    {
      icon: '⏲️',
      title: 'Countdown Timer',
      description: 'Precise countdown functionality with visual progress indicators and sound alerts.',
      color: 'green'
    },
    {
      icon: '🏋️',
      title: 'Training Timer',
      description: 'Specialized workout timer with customizable work/rest intervals and preset management.',
      color: 'purple'
    },
    {
      icon: '🌙',
      title: 'Dark/Light Theme',
      description: 'Automatic theme detection with manual override for the perfect viewing experience.',
      color: 'orange'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Works perfectly on all devices from smartphones to desktop computers.',
      color: 'pink'
    },
    {
      icon: '🔔',
      title: 'Sound Alerts',
      description: 'Audio notifications for timer completion to keep you on track.',
      color: 'indigo'
    }
  ];

  const technologies = [
    { name: 'React 18', description: 'Modern React with concurrent features' },
    { name: 'TypeScript', description: 'Type-safe development' },
    { name: 'Framer Motion', description: 'Smooth animations' },
    { name: 'Tailwind CSS', description: 'Responsive styling' },
    { name: 'PWA', description: 'Offline support & installability' },
    { name: 'High-Precision Timing', description: 'requestAnimationFrame & performance.now()' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            VClock
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The most beautiful and functional timer application on the web, designed to enhance 
            your productivity and fitness routines.
          </p>
        </motion.div>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
            We believe that time management tools should be both powerful and delightful to use. 
            VClock combines precision timing with beautiful design to create an experience that 
            makes every second count. Whether you're timing a workout, managing productivity, 
            or simply keeping track of time, VClock is designed to be your perfect companion.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 dark:border-white/10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
            Why Choose VClock?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                🚀 Performance & Precision
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>High-precision timing using modern web APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Drift-free countdown timers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Smooth 60fps animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Offline support with PWA technology</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                🎨 Design & Experience
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Beautiful glassmorphism design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Responsive across all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Keyboard shortcuts for power users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>No registration or downloads required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          Built with Modern Technology
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          VClock is built with cutting-edge web technologies to ensure the best possible experience, 
          performance, and reliability.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            >
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">{tech.name}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Forever Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 text-center border border-green-200 dark:border-green-800">
          <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200">
            Free Forever 💚
          </h2>
          <p className="text-lg text-green-700 dark:text-green-300 max-w-3xl mx-auto mb-6">
            VClock is completely free to use and always will be. We're supported by non-intrusive 
            advertisements that help us maintain and improve the service. We're committed to keeping 
            VClock accessible to everyone, everywhere.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold text-green-800 dark:text-green-200">No hidden fees, ever!</span>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          What's Coming Next?
        </h2>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-white/10">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            We're constantly working to improve VClock. Here's what we're planning:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-gray-700 dark:text-gray-300">Pomodoro timer mode for productivity</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-gray-700 dark:text-gray-300">Multiple simultaneous timers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-gray-700 dark:text-gray-300">Custom sound uploads</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="text-gray-700 dark:text-gray-300">Workout statistics and history</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <span className="text-gray-700 dark:text-gray-300">Social sharing capabilities</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                <span className="text-gray-700 dark:text-gray-300">Advanced workout analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 border border-blue-200 dark:border-blue-800">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">
            Get in Touch
          </h2>
          <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-2xl mx-auto">
            We love hearing from our users! Whether you have feedback, suggestions, 
            or just want to say hello, we're here to listen.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold text-blue-800 dark:text-blue-200">Email</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">hello@vclock.app</div>
            </div>
            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
              <div className="text-2xl mb-2">🛠️</div>
              <div className="font-semibold text-blue-800 dark:text-blue-200">Support</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">support@vclock.app</div>
            </div>
            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-semibold text-blue-800 dark:text-blue-200">Website</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">vclock.app</div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
