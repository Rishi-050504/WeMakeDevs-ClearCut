import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Download, 
  Eye, 
  AlertTriangle, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  X, 
  Menu, 
  ArrowLeft,
  Scale,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/all-components';

interface LegalAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewPostSummary: () => void;
}

export function LegalAnalysisPage({ onLogout, onBack, onViewAnalytics }: LegalAnalysisPageProps) {
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
          message: 'Based on the legal document analysis, this contract appears to have standard terms with a few clauses that require attention. The liability limitations and termination conditions should be reviewed carefully.' 
        }]);
      }, 1000);
      setChatMessage('');
    }
  };

  const legalData = {
    riskScore: 7,
    contractInfo: {
      title: "Service Agreement Contract",
      parties: ["TechCorp Inc.", "Digital Solutions LLC"],
      effectiveDate: "January 1, 2024",
      termDate: "December 31, 2024",
      value: "$50,000"
    },
    overview: {
      totalClauses: 24,
      pages: 8,
      riskLevel: "Moderate",
      category: "Service Agreement"
    },
    riskyClauses: [
      { 
        clause: "Unlimited Liability", 
        section: "Section 8.2", 
        risk: "high",
        description: "No cap on liability exposure for damages"
      },
      { 
        clause: "Automatic Renewal", 
        section: "Section 12.1", 
        risk: "moderate",
        description: "Contract auto-renews without explicit consent"
      },
      { 
        clause: "IP Assignment", 
        section: "Section 5.4", 
        risk: "moderate",
        description: "Broad intellectual property assignment clause"
      }
    ],
    keyTerms: [
      { term: "Payment Terms", value: "Net 30 days", status: "standard" },
      { term: "Governing Law", value: "Delaware State Law", status: "favorable" },
      { term: "Dispute Resolution", value: "Binding Arbitration", status: "neutral" },
      { term: "Confidentiality", value: "Mutual NDA included", status: "favorable" }
    ],
    recommendations: [
      "Add liability cap of $100,000 maximum",
      "Modify auto-renewal to require 60-day notice",
      "Clarify IP ownership rights",
      "Review termination procedures"
    ]
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" };
    if (score <= 6) return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" };
    return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'moderate': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'high': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'favorable': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'neutral': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'unfavorable': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Scale },
    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'terms', label: 'Key Terms', icon: FileText },
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">Legal Analysis</h1>
              <p className="text-xs text-black/60">Contract review & risk assessment</p>
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
          {/* Risk Score */}
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
                    strokeDasharray={`${(legalData.riskScore / 10) * 251.2} 251.2`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-black text-black" style={{ fontSize: '18px' }}>{legalData.riskScore}</div>
                    <div className="text-black/60" style={{ fontSize: '10px' }}>/ 10</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1" style={{ fontSize: '13px' }}>Risk Score</h3>
              <Badge variant="secondary" className={`${getRiskColor(legalData.riskScore).bg} ${getRiskColor(legalData.riskScore).text} ${getRiskColor(legalData.riskScore).border}`}>
                {legalData.riskScore <= 3 ? 'Low Risk' : 
                 legalData.riskScore <= 6 ? 'Moderate Risk' : 
                 'High Risk'}
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
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'bg-white border-black/10 text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-black/60'}`} />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          {/* Contract Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-black/5 rounded-lg"
          >
            <h4 className="font-bold text-black mb-3">Contract Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Type:</span>
                <span className="font-medium text-black">{legalData.overview.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Value:</span>
                <span className="font-medium text-black">{legalData.contractInfo.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Duration:</span>
                <span className="font-medium text-black">12 months</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
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
                  <h2 className="text-xl font-black text-black mb-1">Contract Overview</h2>
                  <p className="text-sm text-black/60">Comprehensive analysis of contract terms and conditions</p>
                </div>

                {/* Contract Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-bold text-black mb-3">Contract Parties</h3>
                    <div className="space-y-2">
                      {legalData.contractInfo.parties.map((party, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="text-xs text-black truncate">{party}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-sm font-bold text-black mb-3">Contract Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">Effective Date:</span>
                        <span className="text-xs font-medium text-black">{legalData.contractInfo.effectiveDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">End Date:</span>
                        <span className="text-xs font-medium text-black">{legalData.contractInfo.termDate}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-black/60" />
                        <span>Total Clauses</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-black mb-1">
                        {legalData.overview.totalClauses}
                      </div>
                      <p className="text-sm text-black/60">Contract sections</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Risk Level</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-black mb-1">
                        {legalData.overview.riskLevel}
                      </div>
                      <p className="text-sm text-black/60">Overall assessment</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span>Contract Value</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-black mb-1">
                        {legalData.contractInfo.value}
                      </div>
                      <p className="text-sm text-black/60">Total value</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-black/60" />
                        <span>Document</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-black mb-1">
                        {legalData.overview.pages}
                      </div>
                      <p className="text-sm text-black/60">Pages total</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'risks' && (
              <motion.div
                key="risks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">Risk Analysis</h2>
                  <p className="text-black/60">High-risk clauses requiring attention</p>
                </div>

                <div className="space-y-4">
                  {legalData.riskyClauses.map((clause, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getRiskIcon(clause.risk)}
                            <div>
                              <h3 className="font-bold text-black">{clause.clause}</h3>
                              <p className="text-sm text-black/60 mt-1">{clause.section}</p>
                              <p className="text-sm text-black/80 mt-2">{clause.description}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={clause.risk === 'high' ? 'destructive' : 
                                    clause.risk === 'moderate' ? 'warning' : 'success'}
                          >
                            {clause.risk} risk
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">Key Terms</h2>
                  <p className="text-black/60">Important contract provisions and their status</p>
                </div>

                <div className="space-y-4">
                  {legalData.keyTerms.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getStatusIcon(term.status)}
                            <div>
                              <h3 className="font-bold text-black">{term.term}</h3>
                              <p className="text-sm text-black/80 mt-1">{term.value}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={term.status === 'favorable' ? 'success' : 
                                    term.status === 'neutral' ? 'secondary' : 'destructive'}
                          >
                            {term.status}
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
                  <h2 className="text-2xl font-black text-black mb-2">Legal Recommendations</h2>
                  <p className="text-black/60">Suggested modifications and action items</p>
                </div>

                <div className="space-y-4">
                  {legalData.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
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
                  <h2 className="text-2xl font-black text-black mb-2">Contract Summary</h2>
                  <p className="text-black/60">AI-generated legal analysis with critical clauses highlighted</p>
                </div>

                <div className="space-y-6">
                  {/* Executive Summary */}
                  <Card className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <Scale className="w-5 h-5 text-blue-600" />
                        <span>Executive Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-black">
                          This <span className="bg-blue-100 px-2 py-1 rounded font-medium text-blue-800">Service Agreement Contract</span> between TechCorp Inc. and Digital Solutions LLC presents a <span className="bg-yellow-100 px-2 py-1 rounded font-medium">moderate risk profile</span> with several clauses requiring attention. The contract value of <span className="bg-green-100 px-2 py-1 rounded font-medium text-green-800">$50,000</span> suggests a significant business relationship.
                        </p>
                        <p className="text-black mt-3">
                          Key concerns include <span className="bg-red-100 px-2 py-1 rounded font-medium text-red-800">unlimited liability exposure</span> and <span className="bg-yellow-100 px-2 py-1 rounded font-medium">automatic renewal clauses</span>. However, the contract includes favorable terms such as <span className="bg-green-100 px-2 py-1 rounded font-medium text-green-800">mutual confidentiality provisions</span> and Delaware governing law.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Critical Clauses */}
                  <Card className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>Critical Risk Areas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-black">High Priority Issues</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-black">Unlimited Liability (Section 8.2)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm text-black">Auto-Renewal (Section 12.1)</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-black">Favorable Terms</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-black">Delaware Governing Law</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-black">Mutual Confidentiality</span>
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
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span>Recommended Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { priority: 'high', action: 'Negotiate liability cap of $100,000 maximum', impact: 'Limits financial exposure' },
                          { priority: 'high', action: 'Modify auto-renewal to require 60-day notice', impact: 'Provides exit flexibility' },
                          { priority: 'medium', action: 'Clarify intellectual property ownership rights', impact: 'Protects IP assets' },
                          { priority: 'low', action: 'Review termination procedures and notice requirements', impact: 'Ensures clear exit process' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-black/5 rounded-lg">
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              item.priority === 'high' ? 'bg-red-500' :
                              item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-black">{item.action}</p>
                              <p className="text-xs text-black/60">Impact: {item.impact}</p>
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
        <div className="w-96 bg-white border-l border-black/10 p-6 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black">Legal Assistant</h3>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-black/30" />
                <p>Ask me about contract terms, risks, or legal advice</p>
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
              placeholder="Ask about contract clauses, risks, or legal implications..."
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
            <DialogTitle>Legal Document</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-black/5 rounded-lg">
            <p className="text-black/60 mb-4">Original contract document would be displayed here...</p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded border">
                <h4 className="font-bold text-black mb-2">{legalData.contractInfo.title}</h4>
                <p className="text-sm text-black/60">Complete contract terms and conditions...</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}