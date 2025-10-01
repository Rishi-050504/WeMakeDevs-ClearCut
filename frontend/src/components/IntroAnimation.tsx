import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [coverTitle, setCoverTitle] = useState(false);

  useEffect(() => {
    // Show title after background slide completes
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 800);

    // Cover title after 1.5 seconds
    const coverTimer = setTimeout(() => {
      setCoverTitle(true);
    }, 2300);

    // Complete intro after cover animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(coverTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Sliding background */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="absolute inset-0 bg-black"
      />

      {/* ClearCut Title */}
      {showTitle && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.h1 
            className="text-8xl font-extrabold tracking-tight text-white"
            style={{
              fontFamily: 'Cooper Black, serif'
            }}
          >
            ClearCut
          </motion.h1>
        </motion.div>
      )}

      {/* Cover animation */}
      {coverTitle && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ 
            duration: 1, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="absolute inset-0 z-10 bg-black"
        />
      )}
    </div>
  );
}