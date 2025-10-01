import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Menu,
  ArrowLeft,
  CheckCircle,
  Upload,
  Zap
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui/all-components';

interface SummaryPageProps {
  documentType: 'medical' | 'legal' | 'general';
  fileName: string;
  fileSize: string;
  context: string;
  onProceed: () => void;
  onBack: () => void;
  onLogout: () => void;
  onViewAnalytics: () => void;
}

export function SummaryPage({ 
  documentType, 
  fileName, 
  fileSize, 
  context, 
  onProceed, 
  onBack, 
  onLogout, 
  onViewAnalytics 
}: SummaryPageProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getTypeConfig = () => {
    switch (documentType) {
      case 'medical':
        return {
          title: 'Medical Document',
          icon: '🏥',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          description: 'Ready for comprehensive medical analysis'
        };
      case 'legal':
        return {
          title: 'Legal Document',
          icon: '⚖️',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          description: 'Ready for legal risk assessment'
        };
      case 'general':
        return {
          title: 'General Document',
          icon: '📄',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          description: 'Ready for comprehensive analysis'
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-black/10 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-black hover:text-black hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          <div className="h-6 w-px bg-black/20" />
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${typeConfig.bgColor} rounded-lg`}>
              <CheckCircle className={`w-5 h-5 ${typeConfig.color}`} />
            </div>
            <div>
              <h1 className="font-black text-black" style={{ fontSize: '16px' }}>Upload Summary</h1>
              <p className="text-black/60" style={{ fontSize: '11px' }}>Review before analysis</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-xl z-50"
              >
                <button
                  onClick={() => {
                    onViewAnalytics();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors"
                >
                  Analytics
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-black/10"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-3 md:p-6">
        <div className="max-w-xl w-full space-y-4 md:space-y-5 my-3">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="font-black text-black mb-1.5" style={{ fontSize: '22px' }}>Upload Successful!</h1>
            <p className="text-black/60" style={{ fontSize: '13px' }}>Your document has been uploaded and is ready for analysis</p>
          </motion.div>

          {/* Document Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`${typeConfig.borderColor} border-2`}>
              <CardHeader className={`${typeConfig.bgColor} rounded-t-xl`}>
                <CardTitle className="flex items-center space-x-2.5">
                  <span style={{ fontSize: '18px' }}>{typeConfig.icon}</span>
                  <div>
                    <div className="font-black text-black" style={{ fontSize: '16px' }}>{typeConfig.title}</div>
                    <div className="text-black/60" style={{ fontSize: '12px' }}>{typeConfig.description}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* File Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-black/60" style={{ fontSize: '12px' }}>File Name</label>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <FileText className="w-3.5 h-3.5 text-black/60" />
                        <span className="font-medium text-black truncate" style={{ fontSize: '13px' }}>{fileName}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="font-medium text-black/60" style={{ fontSize: '12px' }}>File Size</label>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <Upload className="w-3.5 h-3.5 text-black/60" />
                        <span className="font-medium text-black" style={{ fontSize: '13px' }}>{fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-black/60" style={{ fontSize: '12px' }}>Upload Time</label>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-black/60" />
                        <span className="font-medium text-black" style={{ fontSize: '13px' }}>{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="font-medium text-black/60" style={{ fontSize: '12px' }}>Upload Date</label>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-black/60" />
                        <span className="font-medium text-black" style={{ fontSize: '13px' }}>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Context Information */}
                {context && (
                  <div>
                    <label className="font-medium text-black/60" style={{ fontSize: '12px' }}>Additional Context</label>
                    <div className="mt-1.5 p-3 bg-black/5 rounded-lg border border-black/10">
                      <p className="text-black" style={{ fontSize: '12px' }}>{context}</p>
                    </div>
                  </div>
                )}

                {/* Analysis Preview */}
                <div className="bg-black/5 rounded-lg p-3 border border-black/10">
                  <h3 className="font-bold text-black mb-2" style={{ fontSize: '13px' }}>What happens next?</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-black" style={{ fontSize: '12px' }}>Document processing and OCR extraction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-black" style={{ fontSize: '12px' }}>AI-powered content analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-black" style={{ fontSize: '12px' }}>
                        {documentType === 'medical' && 'Medical findings and risk assessment'}
                        {documentType === 'legal' && 'Legal risk analysis and clause review'}
                        {documentType === 'general' && 'Key insights and actionable recommendations'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Upload Different File
            </Button>
            
            <Button
              onClick={onProceed}
              className={`px-8 ${
                documentType === 'medical' ? 'bg-red-600 hover:bg-red-700' :
                documentType === 'legal' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-1.5 text-black/60 bg-black/5 px-3 py-1.5 rounded-full" style={{ fontSize: '12px' }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Estimated analysis time: 2-3 minutes</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}