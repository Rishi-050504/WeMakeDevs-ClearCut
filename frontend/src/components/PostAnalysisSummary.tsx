import { motion } from 'motion/react';
import { FileText, Download, ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Menu } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui/all-components';
import { useState } from 'react';

interface PostAnalysisSummaryProps {
  documentType: 'medical' | 'legal' | 'general';
  fileName: string;
  onBack: () => void;
  onBackToUpload: () => void;
  onLogout: () => void;
  onViewAnalytics: () => void;
}

export function PostAnalysisSummary({ 
  documentType, 
  fileName, 
  onBack, 
  onBackToUpload, 
  onLogout, 
  onViewAnalytics 
}: PostAnalysisSummaryProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getDocumentIcon = () => {
    switch (documentType) {
      case 'medical': return '🏥';
      case 'legal': return '⚖️';
      case 'general': return '📄';
    }
  };

  const getSummaryData = () => {
    switch (documentType) {
      case 'medical':
        return {
          title: 'Medical Document Analysis Complete',
          keyFindings: [
            'No critical abnormalities detected',
            '2 areas requiring follow-up',
            'Blood pressure readings within normal range',
            'Recommended preventive care scheduling'
          ],
          riskLevel: 'Low',
          riskColor: 'text-green-600',
          urgencyScore: '2/10',
          timeline: 'Follow-up in 3 months',
          sections: ['Patient History', 'Vital Signs', 'Lab Results', 'Recommendations']
        };
      case 'legal':
        return {
          title: 'Legal Document Analysis Complete',
          keyFindings: [
            'Standard contract terms identified',
            '1 high-risk clause detected',
            'Compliance requirements verified',
            'Recommended legal review points'
          ],
          riskLevel: 'Medium',
          riskColor: 'text-yellow-600',
          urgencyScore: '5/10',
          timeline: 'Review within 2 weeks',
          sections: ['Contract Terms', 'Risk Assessment', 'Compliance Check', 'Recommendations']
        };
      case 'general':
        return {
          title: 'Document Analysis Complete',
          keyFindings: [
            'Document structure validated',
            'Key information extracted',
            'Content categories identified',
            'Action items prioritized'
          ],
          riskLevel: 'Low',
          riskColor: 'text-green-600',
          urgencyScore: '3/10',
          timeline: 'No urgent action required',
          sections: ['Summary', 'Key Points', 'Categories', 'Action Items']
        };
    }
  };

  const summaryData = getSummaryData();

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-12 py-3 border-b border-black/10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-black/60 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <div className="h-6 w-px bg-black/20" />
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-black" strokeWidth={2} />
            <h1 
              className="text-2xl font-black text-black"
              style={{ fontFamily: 'Cooper Black, serif' }}
            >
              ClearCut
            </h1>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="text-black/60 hover:text-black"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg z-10"
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
                  onBackToUpload();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors border-t border-black/10"
              >
                New Upload
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
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{getDocumentIcon()}</div>
            <h1 className="text-4xl font-black text-black" style={{ fontFamily: 'Cooper Black, serif' }}>
              {summaryData.title}
            </h1>
            <p className="text-xl text-black/60">
              Complete analysis summary for <span className="font-medium text-black">{fileName}</span>
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Assessment */}
            <Card className="border-2 border-black/10">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-black" />
                  <CardTitle className="text-lg text-black">Risk Assessment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Overall Risk:</span>
                    <Badge className={`${summaryData.riskColor} bg-transparent border border-current`}>
                      {summaryData.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Urgency Score:</span>
                    <span className="font-medium text-black">{summaryData.urgencyScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-2 border-black/10">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-black" />
                  <CardTitle className="text-lg text-black">Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Next Action:</span>
                    <span className="font-medium text-black text-sm">{summaryData.timeline}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Completed:</span>
                    <span className="font-medium text-black">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Status */}
            <Card className="border-2 border-black/10">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg text-black">Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Analysis:</span>
                    <Badge className="text-green-600 bg-green-50 border border-green-200">
                      Complete
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Sections:</span>
                    <span className="font-medium text-black">{summaryData.sections.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Findings */}
          <Card className="border-2 border-black/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-black" />
                  <CardTitle className="text-xl text-black">Key Findings</CardTitle>
                </div>
                <Badge className="text-black/60 bg-black/5 border border-black/20">
                  {summaryData.keyFindings.length} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryData.keyFindings.map((finding, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-black/5 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-black/80">{finding}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Sections */}
          <Card className="border-2 border-black/10">
            <CardHeader>
              <CardTitle className="text-xl text-black">Analyzed Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryData.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 border border-black/20 rounded-lg text-center hover:bg-black/5 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-black">{section}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => {/* Handle download */}}
              className="bg-black text-white hover:bg-black/90 px-8 py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>
            <Button
              variant="outline"
              onClick={onBackToUpload}
              className="border-black text-black hover:bg-black hover:text-white px-8 py-3"
            >
              Analyze Another Document
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}