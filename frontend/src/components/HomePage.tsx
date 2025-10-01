import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { Button } from './ui/all-components';
import { useState } from 'react';

const bgImageUrl = 'https://i.pinimg.com/1200x/a3/cc/07/a3cc0715f422f7ac8e23526d95d48741.jpg';

interface HomePageProps {
  onGetStarted: () => void;
  onLogout?: () => void;
  onViewAnalytics?: () => void;
  isLoggedIn: boolean;
}

export function HomePage({ onGetStarted, onLogout, onViewAnalytics, isLoggedIn }: HomePageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const documentTypes = [
    {
      id: 'medical',
      title: 'Medical Documents',
      description: 'Analyze medical reports, prescriptions, and health records'
    },
    {
      id: 'legal',
      title: 'Legal Documents',
      description: 'Review contracts, agreements, and legal papers'
    },
    {
      id: 'general',
      title: 'General Documents',
      description: 'Process business documents, reports, and more'
    }
  ];

  return (
    <div 
      className="h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(51, 49, 49, 0.6)' }}></div>
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex">
        
        {/* Left side content */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          
          {/* Menu (only if logged in) */}
          {isLoggedIn && (
            <div className="absolute top-8 left-8">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-white hover:bg-white/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        onViewAnalytics?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors text-black"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => {
                        onLogout?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-black hover:bg-black/5 transition-colors border-t border-black/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Document type sections */}
          <div className="space-y-5">
            {documentTypes.map((docType, index) => (
              <motion.div
                key={docType.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredSection(docType.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-baseline space-x-3 relative z-10 p-4 rounded-lg transition-all duration-300 group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/20">
                  <span className="text-white/60 font-light" style={{ fontSize: '14px' }}>
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <div>
                    <h3 className="text-white font-light mb-1 transition-opacity group-hover:opacity-90" style={{ fontSize: '18px' }}>
                      {docType.title}
                    </h3>
                    <p className="text-white/70 max-w-sm" style={{ fontSize: '13px' }}>
                      {docType.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <Button
              onClick={onGetStarted}
              className="bg-white text-black hover:bg-white/90 px-6 py-2 uppercase tracking-wider font-medium"
              style={{ fontSize: '13px' }}
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Right side - Main title */}
        <div className="w-1/2 flex flex-col justify-center items-end px-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-right"
          >
            {/* Location indicator */}
            <div className="text-white/60 mb-3 uppercase tracking-wider" style={{ fontSize: '11px' }}>
              Document Analysis Platform
            </div>
            
            {/* Main title */}
            <h1 
              className="text-white font-black mb-6 leading-none"
              style={{ 
                fontFamily: 'Libre Baskerville, serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: '56px'
              }}
            >
              ClearCut
            </h1>
            
            {/* Tagline */}
            <p className="text-white font-light opacity-90" style={{ fontSize: '16px' }}>
              Document analysis made simple
            </p>
          </motion.div>

          {/* Bottom right corner text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 right-8 text-white/60 text-xs"
          >
            © 2025 ClearCut
          </motion.div>
        </div>
      </div>
    </div>
  );
}