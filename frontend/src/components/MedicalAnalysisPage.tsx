import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Download, 
  Eye, 
  AlertCircle, 
  Activity, 
  CheckCircle, 
  Pill, 
  MessageSquare, 
  X, 
  Menu, 
  ArrowLeft, 
  FileText,
  Heart,
  TrendingUp,
  AlertTriangle,
  User,
  Calendar,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/all-components';

interface MedicalAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewPostSummary: () => void;
}

export function MedicalAnalysisPage({ onLogout, onBack, onViewAnalytics, onViewPostSummary }: MedicalAnalysisPageProps) {
  const [showDocument, setShowDocument] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { role: 'user', message: chatMessage }]);
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          message: 'Based on the medical document analysis, I can help clarify any findings. The patient shows normal vital signs with some minor recommendations for lifestyle improvements.' 
        }]);
      }, 1000);
      setChatMessage('');
    }
  };

  const medicalData = {
    urgencyScore: 3,
    patientInfo: {
      name: "John Smith",
      age: 45,
      gender: "Male",
      mrn: "MRN-2024-001"
    },
    vitalSigns: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      respiratoryRate: "16/min"
    },
    abnormalFindings: [
      { finding: "Elevated cholesterol", severity: "moderate", value: "240 mg/dL" },
      { finding: "Mild dehydration", severity: "low", value: "BUN 25 mg/dL" }
    ],
    medications: [
      { name: "Lisinopril", dosage: "10mg daily", interaction: "none" },
      { name: "Metformin", dosage: "500mg twice daily", interaction: "monitor glucose" },
      { name: "Aspirin", dosage: "81mg daily", interaction: "bleeding risk" }
    ],
    recommendations: [
      "Dietary consultation for cholesterol management",
      "Increase fluid intake",
      "Follow-up in 3 months",
      "Monitor blood glucose levels"
    ]
  };

  const getUrgencyColor = (score: number) => {
    if (score <= 2) return "bg-green-100 text-green-800 border-green-300";
    if (score <= 4) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'moderate': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'findings', label: 'Findings', icon: AlertCircle },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'recommendations', label: 'Recommendations', icon: CheckCircle },
    { id: 'summary', label: 'Summary', icon: FileText }
  ];

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Header */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-black/10 bg-white">
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
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">Medical Analysis</h1>
              <p className="text-xs text-black/60">Comprehensive health document review</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowDocument(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Document
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          
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

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-black/10 p-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Urgency Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
          >
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent"
                    className="text-black/10"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent"
                    strokeDasharray={`${(medicalData.urgencyScore / 10) * 251.2} 251.2`}
                    className="text-red-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-black text-black" style={{ fontSize: '18px' }}>{medicalData.urgencyScore}</div>
                    <div className="text-black/60" style={{ fontSize: '10px' }}>/ 10</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1" style={{ fontSize: '13px' }}>Urgency Score</h3>
              <Badge variant="secondary" className={getUrgencyColor(medicalData.urgencyScore)}>
                {medicalData.urgencyScore <= 2 ? 'Low Priority' : 
                 medicalData.urgencyScore <= 4 ? 'Moderate Priority' : 
                 'High Priority'}
              </Badge>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="space-y-2">
            {tabItems.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                    isActive 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-white border-black/10 text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-black/60'}`} />
                  <span className="font-medium" style={{ fontSize: '13px' }}>{tab.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          {/* Patient Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 p-3 bg-black/5 rounded-lg"
          >
            <h4 className="font-bold text-black mb-2" style={{ fontSize: '13px' }}>Patient Info</h4>
            <div className="space-y-1.5" style={{ fontSize: '12px' }}>
              <div className="flex justify-between">
                <span className="text-black/60">Name:</span>
                <span className="font-medium text-black">{medicalData.patientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Age:</span>
                <span className="font-medium text-black">{medicalData.patientInfo.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">MRN:</span>
                <span className="font-medium text-black">{medicalData.patientInfo.mrn}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-black text-black mb-1" style={{ fontSize: '16px' }}>Medical Overview</h2>
                  <p className="text-black/60" style={{ fontSize: '12px' }}>Comprehensive analysis of patient's medical document</p>
                </div>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {Object.entries(medicalData.vitalSigns).map(([key, value]) => (
                    <Card key={key} className="p-2">
                      <div className="flex items-center space-x-1.5">
                        <div className="p-1 bg-green-100 rounded-lg">
                          <Activity className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-black/60 uppercase tracking-wide truncate" style={{ fontSize: '10px' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-bold text-black truncate" style={{ fontSize: '12px' }}>{value}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <Card>
                    <CardHeader className="pb-1.5">
                      <CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}>
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                        <span>Abnormal Findings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>
                        {medicalData.abnormalFindings.length}
                      </div>
                      <p className="text-black/60" style={{ fontSize: '11px' }}>Issues identified</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-1.5">
                      <CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}>
                        <Pill className="w-3.5 h-3.5 text-blue-600" />
                        <span>Medications</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>
                        {medicalData.medications.length}
                      </div>
                      <p className="text-black/60" style={{ fontSize: '11px' }}>Current prescriptions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-1.5">
                      <CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}>
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <span>Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>
                        {medicalData.recommendations.length}
                      </div>
                      <p className="text-black/60" style={{ fontSize: '11px' }}>Action items</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'findings' && (
              <motion.div
                key="findings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-black mb-1">Abnormal Findings</h2>
                  <p className="text-sm text-black/60">Medical conditions requiring attention</p>
                </div>

                <div className="space-y-3">
                  {medicalData.abnormalFindings.map((finding, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            {getSeverityIcon(finding.severity)}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-black truncate">{finding.finding}</h3>
                              <p className="text-xs text-black/60 mt-1">Value: {finding.value}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={finding.severity === 'high' ? 'destructive' : 
                                    finding.severity === 'moderate' ? 'warning' : 'success'}
                            className="text-xs ml-2"
                          >
                            {finding.severity}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'medications' && (
              <motion.div
                key="medications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-black mb-1">Current Medications</h2>
                  <p className="text-sm text-black/60">Prescription analysis and interactions</p>
                </div>

                <div className="space-y-3">
                  {medicalData.medications.map((medication, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                              <Pill className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-black truncate">{medication.name}</h3>
                              <p className="text-xs text-black/60 mt-1">Dosage: {medication.dosage}</p>
                              <p className="text-xs text-black/60">Interaction: {medication.interaction}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={medication.interaction === 'none' ? 'success' : 'warning'}
                            className="text-xs ml-2"
                          >
                            {medication.interaction === 'none' ? 'Safe' : 'Monitor'}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">Medical Recommendations</h2>
                  <p className="text-black/60">Suggested actions and follow-up care</p>
                </div>

                <div className="space-y-4">
                  {medicalData.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-black font-medium">{recommendation}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-black mb-1">Document Summary</h2>
                  <p className="text-sm text-black/60">AI-generated summary with critical insights highlighted</p>
                </div>

                <div className="space-y-4">
                  {/* Executive Summary */}
                  <Card className="p-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Executive Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-black leading-relaxed">
                          The medical analysis reveals a <span className="bg-yellow-100 px-1 py-0.5 rounded text-xs font-medium">45-year-old male patient</span> with generally stable vital signs but some areas requiring attention. The patient presents with <span className="bg-red-100 px-1 py-0.5 rounded text-xs font-medium text-red-800">elevated cholesterol levels</span> and signs of <span className="bg-yellow-100 px-1 py-0.5 rounded text-xs font-medium">mild dehydration</span>.
                        </p>
                        <p className="text-sm text-black leading-relaxed mt-2">
                          Current medication regimen includes cardiovascular and diabetes management drugs with <span className="bg-blue-100 px-1 py-0.5 rounded text-xs font-medium text-blue-800">appropriate monitoring protocols</span> in place. The overall health status indicates <span className="bg-green-100 px-1 py-0.5 rounded text-xs font-medium text-green-800">manageable conditions</span> with proper lifestyle modifications and continued medical supervision.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <Card className="p-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Critical Points</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-black">Immediate Attention</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-black truncate">Cholesterol: 240 mg/dL (High)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-black truncate">BUN: 25 mg/dL (Elevated)</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-black">Positive Indicators</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-black truncate">Blood Pressure: Normal</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-black truncate">Heart Rate: Stable</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Items */}
                  <Card className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <span>Next Steps</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { priority: 'high', action: 'Schedule dietary consultation for cholesterol management', timeframe: 'Within 1 week' },
                          { priority: 'medium', action: 'Increase daily fluid intake and monitor hydration', timeframe: 'Immediate' },
                          { priority: 'medium', action: 'Follow-up appointment for progress review', timeframe: '3 months' },
                          { priority: 'low', action: 'Continue glucose monitoring with current medication', timeframe: 'Ongoing' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-black/5 rounded-lg">
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              item.priority === 'high' ? 'bg-red-500' :
                              item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-black">{item.action}</p>
                              <p className="text-xs text-black/60">Timeline: {item.timeframe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Sidebar */}
        <div className="w-64 bg-white border-l border-black/10 p-3 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex items-center space-x-1.5 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <h3 className="font-bold text-black" style={{ fontSize: '12px' }}>Medical Assistant</h3>
          </div>

          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-6">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-black/30" />
                <p className="text-xs">Ask me anything about the medical analysis</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-black text-white ml-8' 
                      : 'bg-black/5 text-black mr-8'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </motion.div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder="Ask about medications, findings, or recommendations..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            />
            <Button onClick={handleSendMessage} className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <Dialog open={showDocument} onOpenChange={setShowDocument}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medical Document</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-black/5 rounded-lg">
            <p className="text-black/60 mb-4">Original document content would be displayed here...</p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded border">
                <h4 className="font-bold text-black mb-2">Patient: {medicalData.patientInfo.name}</h4>
                <p className="text-sm text-black/60">Complete medical record and test results...</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}