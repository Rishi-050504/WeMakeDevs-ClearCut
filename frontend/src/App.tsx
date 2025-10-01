import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { LoadingPage } from './components/LoadingPage';
import { SummaryPage } from './components/SummaryPage';
import { LegalAnalysisPage } from './components/LegalAnalysisPage';
import { MedicalAnalysisPage } from './components/MedicalAnalysisPage';
import { GeneralAnalysisPage } from './components/GeneralAnalysisPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { PostAnalysisSummary } from './components/PostAnalysisSummary';

type AppState = 'home' | 'upload' | 'summary' | 'loading' | 'legal-analysis' | 'medical-analysis' | 'general-analysis' | 'post-summary' | 'analytics';

interface AnalyzedDocument {
  id: string;
  name: string;
  type: 'medical' | 'legal' | 'general';
  date: string;
  size: string;
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [documentType, setDocumentType] = useState<'medical' | 'legal' | 'general'>('medical');
  const [analyzedDocuments, setAnalyzedDocuments] = useState<AnalyzedDocument[]>([]);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; context: string } | null>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentState('home');
  };

  const handleGetStarted = () => {
    setCurrentState('upload');
  };

  const handleUpload = (type: 'medical' | 'legal' | 'general', file: File | null, context: string) => {
    setDocumentType(type);
    
    // Store file information for summary
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        context
      });
      
      // Add document to analytics
      const newDoc: AnalyzedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type,
        date: new Date().toLocaleDateString(),
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setAnalyzedDocuments(prev => [newDoc, ...prev]);
    }
    
    // Go to summary first
    setCurrentState('summary');
  };

  const handleProceedFromSummary = () => {
    setCurrentState('loading');
    
    // Simulate analysis processing
    setTimeout(() => {
      if (documentType === 'medical') {
        setCurrentState('medical-analysis');
      } else if (documentType === 'legal') {
        setCurrentState('legal-analysis');
      } else {
        setCurrentState('general-analysis');
      }
    }, 3000); // 3 seconds loading
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentState('home');
    setAnalyzedDocuments([]);
  };

  const handleBackToUpload = () => {
    setCurrentState('upload');
  };

  const handleViewAnalytics = () => {
    setCurrentState('analytics');
  };

  const handleViewPostSummary = () => {
    setCurrentState('post-summary');
  };

  const handleBackToAnalysis = () => {
    if (documentType === 'medical') {
      setCurrentState('medical-analysis');
    } else if (documentType === 'legal') {
      setCurrentState('legal-analysis');
    } else {
      setCurrentState('general-analysis');
    }
  };

  return (
    <div className="size-full">
      <AnimatePresence mode="wait">
        {!isLoggedIn && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <HomePage 
              onGetStarted={handleGetStarted} 
              onLogout={handleLogout}
              onViewAnalytics={handleViewAnalytics}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <UploadPage 
              onUpload={handleUpload} 
              onLogout={handleLogout}
              onViewAnalytics={handleViewAnalytics}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnalyticsPage
              documents={analyzedDocuments}
              onLogout={handleLogout}
              onViewAnalytics={handleViewAnalytics}
              onBackToUpload={handleBackToUpload}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'summary' && uploadedFile && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SummaryPage
              documentType={documentType}
              fileName={uploadedFile.name}
              fileSize={uploadedFile.size}
              context={uploadedFile.context}
              onProceed={handleProceedFromSummary}
              onBack={handleBackToUpload}
              onLogout={handleLogout}
              onViewAnalytics={handleViewAnalytics}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingPage documentType={documentType} />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'legal-analysis' && (
          <motion.div
            key="legal-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <LegalAnalysisPage 
              onLogout={handleLogout} 
              onBack={handleBackToUpload}
              onViewAnalytics={handleViewAnalytics}
              onViewPostSummary={handleViewPostSummary}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'medical-analysis' && (
          <motion.div
            key="medical-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MedicalAnalysisPage 
              onLogout={handleLogout} 
              onBack={handleBackToUpload}
              onViewAnalytics={handleViewAnalytics}
              onViewPostSummary={handleViewPostSummary}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'general-analysis' && (
          <motion.div
            key="general-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <GeneralAnalysisPage 
              onLogout={handleLogout} 
              onBack={handleBackToUpload}
              onViewAnalytics={handleViewAnalytics}
              onViewPostSummary={handleViewPostSummary}
            />
          </motion.div>
        )}

        {isLoggedIn && currentState === 'post-summary' && uploadedFile && (
          <motion.div
            key="post-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PostAnalysisSummary
              documentType={documentType}
              fileName={uploadedFile.name}
              onBack={handleBackToAnalysis}
              onBackToUpload={handleBackToUpload}
              onLogout={handleLogout}
              onViewAnalytics={handleViewAnalytics}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}