import { motion } from 'motion/react';
import { FileSearch, Brain, Zap, CheckCircle, Circle, Sparkles, FileText, Eye, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import documentImage from 'figma:asset/0756eb4cb179b6a80e3f4d80d5436f1198a18ffc.png';

interface LoadingPageProps {
  documentType: 'medical' | 'legal' | 'general';
}

export function LoadingPage({ documentType }: LoadingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    { label: 'Uploading document', icon: FileSearch },
    { label: 'Processing content', icon: Brain },
    { label: 'AI Analysis in progress', icon: Zap },
    { label: 'Extracting key insights', icon: Brain },
    { label: 'Finalizing results', icon: CheckCircle }
  ];

  useEffect(() => {
    const stepDuration = 600; // Each step takes 600ms
    const totalDuration = loadingSteps.length * stepDuration;
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + (100 / (totalDuration / 50)); // Update every 50ms
        }
        return 100;
      });
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const getDocumentColor = () => {
    switch (documentType) {
      case 'medical': return 'from-green-400 to-green-600';
      case 'legal': return 'from-blue-400 to-blue-600';
      case 'general': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-white via-black/5 to-white flex items-center justify-center overflow-hidden relative">
      {/* Background Document Stack Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <motion.div
          animate={{ 
            rotate: [0, 2, -2, 0],
            scale: [1, 1.02, 0.98, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <img 
            src={documentImage} 
            alt="Document Stack" 
            className="w-96 h-96 object-cover rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent rounded-2xl"></div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 max-w-2xl mx-auto px-4 md:px-8 relative z-10"
      >
        {/* Central Animation Stack */}
        <div className="relative flex justify-center items-center">
          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{
                  x: [0, Math.sin(i) * 50, 0],
                  y: [0, Math.cos(i) * 30, 0],
                  rotate: [0, i * 60, 360],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                style={{
                  left: `${20 + (i * 60) % 60}%`,
                  top: `${30 + (i * 40) % 40}%`
                }}
              >
                {i % 3 === 0 ? (
                  <FileText className="w-6 h-6 text-black/40" />
                ) : i % 3 === 1 ? (
                  <Eye className="w-5 h-5 text-black/40" />
                ) : (
                  <Sparkles className="w-4 h-4 text-black/40" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Central Element */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-black via-black/90 to-black/80 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
              <Layers className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
            
            {/* Static Rings */}
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  width: `${128 + ring * 24}px`,
                  height: `${128 + ring * 24}px`,
                  left: `${-ring * 12}px`,
                  top: `${-ring * 12}px`
                }}
              >
                <div 
                  className={`w-full h-full rounded-full border border-black/20`}
                  style={{
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                  }}
                />
                <div className={`absolute w-3 h-3 rounded-full ${
                  ring === 1 ? 'bg-red-500' : ring === 2 ? 'bg-blue-500' : 'bg-green-500'
                }`} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-black text-black"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Processing
            </motion.span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="ml-2"
            >
              Document
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-black/70"
          >
            Our AI is analyzing your {documentType} document with precision
          </motion.p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="space-y-4">
          <div className="relative w-full bg-black/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-black via-black/80 to-black rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-black">{Math.round(progress)}% Complete</p>
            <Sparkles className="w-4 h-4 text-black/60" />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                  isCurrent ? 'bg-black/10 border-black/30 shadow-lg' : 
                  isCompleted ? 'bg-black/5 border-black/10' : 
                  'bg-white/50 border-black/10'
                }`}
              >
                <div className={`p-3 rounded-full ${
                  isCurrent ? 'bg-black text-white shadow-lg' : 
                  isCompleted ? 'bg-black text-white' : 
                  'bg-black/10 text-black/40'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <span className={`font-medium text-sm ${
                  isCurrent ? 'text-black' : 
                  isCompleted ? 'text-black' : 
                  'text-black/40'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Fun Fact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="relative bg-gradient-to-r from-black/10 via-black/5 to-black/10 p-6 rounded-2xl border border-black/20"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-black/60" />
            <p className="text-black/80 font-medium text-sm">
              Our advanced AI processes documents 100x faster than traditional methods, extracting key insights with precision
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}