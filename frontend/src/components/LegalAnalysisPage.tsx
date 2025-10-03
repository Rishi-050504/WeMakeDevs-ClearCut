import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Download, Eye, AlertTriangle, Users, FileText, MessageSquare, X, Menu, ArrowLeft,
  Scale, Shield, Clock, TrendingUp, CheckCircle, AlertCircle, XCircle, DollarSign, Loader2,
  BookOpen
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/all-components';
import { documentAPI, chatAPI } from '../services/api';

interface LegalAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewPostSummary: () => void;
}

interface AnalysisData {
  fileName: string; rawText: string;
  analysis?: {
    riskScore?: number;
    contractInfo?: { parties?: string[]; effectiveDate?: string; termDate?: string; value?: string; pages?: number };
    riskyClauses?: { clause: string; section: string; risk: 'high' | 'moderate' | 'low'; description: string }[];
    keyTerms?: { term: string; value: string; status: 'standard' | 'favorable' | 'neutral' | 'unfavorable' }[];
    recommendations?: string[];
    summary?: { executiveSummary?: string; criticalRisks?: string[]; recommendedActions?: string[] };
  };
}

export function LegalAnalysisPage({ onLogout, onBack, onViewAnalytics }: LegalAnalysisPageProps) {
    const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    const documentId = sessionStorage.getItem('currentDocumentId');
    if (!documentId) {
      setError("No document ID found."); setIsLoading(false); return;
    }
    documentAPI.getById(documentId)
      .then(res => { if (res.data.success) { setData(res.data.document); } else { setError(res.data.message); }})
      .catch(() => setError("Failed to fetch analysis."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSendMessage = async () => {
    const documentId = sessionStorage.getItem('currentDocumentId');
    if (chatMessage.trim() && documentId) {
      const userMessage = { role: 'user' as const, message: chatMessage };
      setChatHistory(prev => [...prev, userMessage]);
      const currentInput = chatMessage;
      setChatMessage('');

      try {
        const response = await chatAPI.send({ documentId, message: currentInput });
        if (response.data.success) {
          const aiMessage = { role: 'ai' as const, message: response.data.message };
          setChatHistory(prev => [...prev, aiMessage]);
        } else {
            throw new Error(response.data.message);
        }
      } catch (err) {
         const errorMessage = { role: 'ai' as const, message: "Sorry, I couldn't get a response. The AI assistant may be offline." };
         setChatHistory(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleDownload = () => {
    const documentId = sessionStorage.getItem('currentDocumentId');
    const token = localStorage.getItem('auth_token');
    if (documentId && token) {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/api/documents/${documentId}/download`;
      fetch(downloadUrl, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        if (!response.ok) throw new Error('Download failed.');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${data?.fileName || 'document'}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => alert(err.message));
    }
  };
  
  const getRiskColor = (score: number) => {
    if (score <= 33) return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", label: "Low Risk" };
    if (score <= 66) return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", label: "Moderate Risk" };
    return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", label: "High Risk" };
  };
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /><p className="ml-4 text-lg">Loading Analysis...</p></div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div>
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">An Error Occurred</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onBack}>Go Back to Upload</Button>
        </div>
      </div>
    );
  }
  const analysis = data.analysis ?? {};
  const riskScore = analysis.riskScore ?? 7;
  const contractInfo = analysis.contractInfo ?? { parties: ["TechCorp Inc.", "Digital Solutions LLC"], effectiveDate: "January 1, 2024", termDate: "December 31, 2024", value: "$50,000", pages: 8 };
  const riskyClauses = analysis.riskyClauses ?? [{ clause: "Unlimited Liability", section: "Section 8.2", risk: "high", description: "No cap on liability exposure for damages" }];
  const keyTerms = analysis.keyTerms ?? [{ term: "Payment Terms", value: "Net 30 days", status: "standard" }];
  const recommendations = analysis.recommendations ?? ["Add liability cap of $100,000 maximum", "Modify auto-renewal to require 60-day notice"];
  const summary = analysis.summary ?? { executiveSummary: "This is a sample agreement...", criticalRisks: ["Unlimited Liability"], recommendedActions: ["Review termination procedures"] };
  const totalClauses = (riskyClauses.length) + (keyTerms.length);
  const riskLabel = riskScore > 66 ? "High Risk" : riskScore > 33 ? "Moderate Risk" : "Low Risk";
  const getRiskBadge = (risk: string) => {
    if (risk === 'high') return <Badge variant="destructive">high risk</Badge>;
    if (risk === 'moderate') return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">moderate risk</Badge>;
    return <Badge variant="secondary" className="bg-green-100 text-green-800">low risk</Badge>;
  };
  const riskColorDetails = getRiskColor(riskScore);
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
    { id: 'terms', label: 'Key Terms', icon: BookOpen }, // Using BookOpen from your new icons
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
          <Button variant="outline" onClick={handleDownload}>
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
                    strokeDasharray={`${(riskScore / 100) * 251.2} 251.2`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-black text-black" style={{ fontSize: '18px' }}>{riskScore}</div>
                    <div className="text-black/60" style={{ fontSize: '10px' }}>/ 100</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1" style={{ fontSize: '13px' }}>Risk Score</h3>
              <Badge variant="secondary" className={`${riskColorDetails.bg} ${riskColorDetails.text} ${riskColorDetails.border}`}>
                {riskColorDetails.label}
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
                <span className="font-medium text-black">Service Agreement</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Value:</span>
                <span className="font-medium text-black">{contractInfo.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Dates:</span>
                <span className="font-medium text-black">{contractInfo.effectiveDate?.split('T')[0]}</span>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-bold text-black mb-3">Contract Parties</h3>
                    <div className="space-y-2">
                      {contractInfo.parties?.map((party, index) => (
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
                        <span className="text-xs font-medium text-black">{contractInfo.effectiveDate?.split('T')[0]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">End Date:</span>
                        <span className="text-xs font-medium text-black">{contractInfo.termDate?.split('T')[0]}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <Card><CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2"><FileText className="w-5 h-5 text-black/60" /><span>Total Clauses</span></CardTitle></CardHeader><CardContent><div className="text-2xl font-black text-black mb-1">{totalClauses}</div><p className="text-sm text-black/60">Identified clauses</p></CardContent></Card>
                    <Card><CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2"><AlertTriangle className="w-5 h-5 text-yellow-600" /><span>Risk Level</span></CardTitle></CardHeader><CardContent><div className="text-2xl font-black text-black mb-1">{riskColorDetails.label}</div><p className="text-sm text-black/60">Overall assessment</p></CardContent></Card>
                    <Card><CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2"><DollarSign className="w-5 h-5 text-green-600" /><span>Contract Value</span></CardTitle></CardHeader><CardContent><div className="text-2xl font-black text-black mb-1">{contractInfo.value}</div><p className="text-sm text-black/60">Total value</p></CardContent></Card>
                    <Card><CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2"><FileText className="w-5 h-5 text-black/60" /><span>Document</span></CardTitle></CardHeader><CardContent><div className="text-2xl font-black text-black mb-1">{contractInfo.pages}</div><p className="text-sm text-black/60">Pages total</p></CardContent></Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'risks' && (
              <motion.div key="risks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div><h2 className="text-2xl font-black text-black mb-2">Risk Analysis</h2><p className="text-black/60">High-risk clauses requiring attention</p></div>
                <div className="space-y-4">
                  {riskyClauses.map((clause, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
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
                          <Badge variant={clause.risk === 'high' ? 'destructive' : clause.risk === 'moderate' ? 'warning' : 'success'}>{clause.risk} risk</Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
               <motion.div key="terms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div><h2 className="text-2xl font-black text-black mb-2">Key Terms</h2><p className="text-black/60">Important contract provisions and their status</p></div>
                <div className="space-y-4">
                  {keyTerms.map((term, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getStatusIcon(term.status)}
                            <div>
                              <h3 className="font-bold text-black">{term.term}</h3>
                              <p className="text-sm text-black/80 mt-1">{term.value}</p>
                            </div>
                          </div>
                           <Badge variant={term.status === 'favorable' ? 'success' : term.status === 'neutral' ? 'secondary' : 'destructive'}>{term.status}</Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div key="recommendations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div><h2 className="text-2xl font-black text-black mb-2">Legal Recommendations</h2><p className="text-black/60">Suggested modifications and action items</p></div>
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
                          <div><p className="text-black font-medium">{recommendation}</p></div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'summary' && (
               <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div><h2 className="text-2xl font-black text-black mb-2">Contract Summary</h2><p className="text-black/60">AI-generated legal analysis with critical clauses highlighted</p></div>
                <div className="space-y-6">
                  <Card className="p-6"><CardHeader className="pb-4"><CardTitle className="flex items-center space-x-2"><Scale className="w-5 h-5 text-blue-600" /><span>Executive Summary</span></CardTitle></CardHeader><CardContent><div className="prose prose-sm max-w-none"><p className="text-black">{summary.executiveSummary}</p></div></CardContent></Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle>Critical Risk Areas</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-1">{summary.criticalRisks?.map((r, i) => <li key={i}>{r}</li>)}</ul></CardContent></Card>
                    <Card><CardHeader><CardTitle>Recommended Actions</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-1">{summary.recommendedActions?.map((a, i) => <li key={i}>{a}</li>)}</ul></CardContent></Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-white border-l border-black/10 p-6 flex flex-col max-h-[calc(100vh-64px)]">
          <div className="flex items-center space-x-2 mb-6 shrink-0">
            <MessageSquare className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black">Legal Assistant</h3>
          </div>

          <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-8 h-full flex flex-col justify-center items-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-black/30" />
                <p>Ask about contract terms, risks, or legal advice</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    message.role === 'user' 
                      ? 'bg-black text-white ml-auto max-w-[85%]' 
                      : 'bg-black/5 text-black mr-auto max-w-[85%]'
                  }`}
                >
                  <p>{message.message}</p>
                </motion.div>
              ))
            )}
          </div>

          <div className="space-y-3 mt-auto shrink-0">
            <Textarea
              placeholder="Ask about contract clauses..."
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
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>{data.fileName || "Legal Document"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap font-mono text-xs overflow-y-auto">
              {data.rawText}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

