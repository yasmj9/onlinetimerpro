import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { SEOHead } from './components/SEOHead';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PageLayout from './components/PageLayout';


function App() {
  
  // Render different pages based on current route
  const route = () => {
        return (

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pages" element={<PageLayout title=''/>} >
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
            </Route> 
          </Routes>

        );

  };

  return (
    <Layout>
      {/* Dynamic SEO meta tags */}
      <SEOHead page={'home'} />
      
      {/* Page transition animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={'home'}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ 
            duration: 0.2, 
            ease: 'easeInOut',
            layout: true
          }}
          className="min-h-screen"
        >
          {route()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;