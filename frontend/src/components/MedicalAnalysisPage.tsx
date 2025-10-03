import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';
import { 
  Download, Eye, AlertTriangle, MessageSquare, X, Menu, ArrowLeft,
  Heart, CheckCircle, Loader2, Pill, Activity,
  User,
  FileText,
  AlertCircleIcon
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/all-components';
import { documentAPI, chatAPI } from '../services/api';

interface MedicalAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewPostSummary: () => void;
}

interface AnalysisData {
  fileName: string; rawText: string;
  analysis?: {
    urgencyScore?: number;
    patientInfo?: { name?: string; age?: number; gender?: string };
    vitalSigns?: { sign: string; value: string; status: 'normal' | 'elevated' | 'low' }[];
    abnormalFindings?: { finding: string; severity: 'high' | 'moderate' | 'low'; details: string }[];
    medications?: { name: string; dosage: string; notes: string }[];
    recommendations?: string[];
    summary?: { executiveSummary?: string; keyConcerns?: string[]; followUpActions?: string[] };
  };
}

export function MedicalAnalysisPage({ onLogout, onBack, onViewAnalytics }: MedicalAnalysisPageProps) {
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
      .then(res => { if (res.data.success && res.data.document.analysis) { setData(res.data.document); } else { setError(res.data.message || "Analysis data is missing or incomplete."); }})
      .catch(() => setError("Failed to fetch analysis from the server."))
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
        const aiMessage = { role: 'ai' as const, message: response.data.message };
        setChatHistory(prev => [...prev, aiMessage]);
      } catch (err) {
         const errorMessage = { role: 'ai' as const, message: "Sorry, I couldn't get a response." };
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
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${data?.fileName || 'document'}.txt`;
        document.body.appendChild(a); a.click(); a.remove();
        window.URL.revokeObjectURL(url);
      });
    }
  };

  if (isLoading) { return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-red-600" /><p className="ml-4 text-lg">Loading Medical Analysis...</p></div>; }
  if (error || !data) { return <div className="flex h-screen w-full items-center justify-center text-center"><div><AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold">An Error Occurred</h2><p className="text-red-600 mb-4">{error}</p><Button onClick={onBack}>Go Back</Button></div></div>; }

  const analysis = data.analysis ?? {};
  const urgencyScore = analysis.urgencyScore ?? 45;
  const patientInfo = analysis.patientInfo ?? { name: "John Smith", age: 45, gender: "Male" };
  const vitalSigns = analysis.vitalSigns ?? [{ sign: "Blood Pressure", value: "120/80 mmHg", status: "normal" }];
  const findings = analysis.abnormalFindings ?? [{ finding: "Elevated Cholesterol", severity: "moderate", details: "Total cholesterol is 240 mg/dL." }];
  const medications = analysis.medications ?? [{ name: "Lisinopril", dosage: "10mg daily", notes: "For blood pressure." }];
  const recommendations = analysis.recommendations ?? ["Follow-up with cardiologist."];
  const summary = analysis.summary ?? { executiveSummary: "Patient shows stable signs with moderate concerns.", keyConcerns: ["Cholesterol"], followUpActions: ["Dietary consultation"] };
  const urgencyLabel = urgencyScore > 66 ? 'High Urgency' : urgencyScore > 33 ? 'Moderate Urgency' : 'Low Urgency';
  const getUrgencyColor = (score: number) => {
    if (score <= 33) return { className: "bg-green-100 text-green-800 border-green-300", label: "Low Priority" };
    if (score <= 66) return { className: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Moderate Priority" };
    return { className: "bg-red-100 text-red-800 border-red-300", label: "High Priority" };
  };
  const urgencyDetails = getUrgencyColor(urgencyScore);
  
  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'findings', label: 'Findings', icon: AlertCircleIcon },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'recommendations', label: 'Recommendations', icon: CheckCircle },
    { id: 'summary', label: 'Summary', icon: FileText }
  ];
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'moderate': return <AlertCircleIcon className="w-4 h-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-black/10 bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-black hover:text-black hover:bg-black/5">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
          </Button>
          <div className="h-6 w-px bg-black/20" />
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg"><Heart className="w-6 h-6 text-red-600" /></div>
            <div>
              <h1 className="text-xl font-black text-black">Medical Analysis</h1>
              <p className="text-xs text-black/60">Comprehensive health document review</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowDocument(true)}><Eye className="w-4 h-4 mr-2" /> View Document</Button>
          <Button variant="outline" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download Report</Button>
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}><Menu className="w-5 h-5" /></Button>
            {showMenu && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-xl z-50">
                <button onClick={() => { onViewAnalytics(); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors">Analytics</button>
                <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-black/10">Logout</button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white border-r border-black/10 p-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10" />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${(urgencyScore / 100) * 251.2} 251.2`} className="text-red-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-black text-black" style={{ fontSize: '18px' }}>{urgencyScore}</div>
                    <div className="text-black/60" style={{ fontSize: '10px' }}>/ 100</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1" style={{ fontSize: '13px' }}>Urgency Score</h3>
              <Badge variant="secondary" className={urgencyDetails.className}>{urgencyDetails.label}</Badge>
            </div>
          </motion.div>

          <div className="space-y-2">
            {tabItems.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button key={tab.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-2 p-3 rounded-lg border transition-all ${isActive ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-black/10 text-black hover:bg-black/5'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-black/60'}`} />
                  <span className="font-medium" style={{ fontSize: '13px' }}>{tab.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-5 p-3 bg-black/5 rounded-lg">
            <h4 className="font-bold text-black mb-2" style={{ fontSize: '13px' }}>Patient Info</h4>
            <div className="space-y-1.5" style={{ fontSize: '12px' }}>
              <div className="flex justify-between"><span className="text-black/60">Name:</span><span className="font-medium text-black">{patientInfo.name}</span></div>
              <div className="flex justify-between"><span className="text-black/60">Age:</span><span className="font-medium text-black">{patientInfo.age}</span></div>
              <div className="flex justify-between"><span className="text-black/60">Gender:</span><span className="font-medium text-black">{patientInfo.gender}</span></div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                <div>
                  <h2 className="font-black text-black mb-1" style={{ fontSize: '16px' }}>Medical Overview</h2>
                  <p className="text-black/60" style={{ fontSize: '12px' }}>Comprehensive analysis of patient's medical document</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {vitalSigns.map((vital) => (
                    <Card key={vital.sign} className="p-2">
                      <div className="flex items-center space-x-1.5">
                        <div className={`p-1 rounded-lg ${vital.status === 'normal' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <Activity className={`w-3 h-3 ${vital.status === 'normal' ? 'text-green-600' : 'text-yellow-700'}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-black/60 uppercase tracking-wide truncate" style={{ fontSize: '10px' }}>{vital.sign}</div>
                          <div className="font-bold text-black truncate" style={{ fontSize: '12px' }}>{vital.value}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <Card><CardHeader className="pb-1.5"><CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}><AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /><span>Abnormal Findings</span></CardTitle></CardHeader><CardContent><div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>{findings.length}</div><p className="text-black/60" style={{ fontSize: '11px' }}>Issues identified</p></CardContent></Card>
                  <Card><CardHeader className="pb-1.5"><CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}><Pill className="w-3.5 h-3.5 text-blue-600" /><span>Medications</span></CardTitle></CardHeader><CardContent><div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>{medications.length}</div><p className="text-black/60" style={{ fontSize: '11px' }}>Current prescriptions</p></CardContent></Card>
                  <Card><CardHeader className="pb-1.5"><CardTitle className="flex items-center space-x-1.5" style={{ fontSize: '12px' }}><CheckCircle className="w-3.5 h-3.5 text-green-600" /><span>Recommendations</span></CardTitle></CardHeader><CardContent><div className="font-black text-black mb-0.5" style={{ fontSize: '16px' }}>{recommendations.length}</div><p className="text-black/60" style={{ fontSize: '11px' }}>Action items</p></CardContent></Card>
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
      {/* FIX: Use the correct variable and remove inline types */}
      {findings.map((finding, index) => (
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
                  <p className="text-xs text-black/60 mt-1">{finding.details}</p>
                </div>
              </div>
              <Badge
                variant={finding.severity === 'high' ? 'destructive' : finding.severity === 'moderate' ? 'warning' : 'success'}
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
              <motion.div key="medications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                <div><h2 className="text-xl font-black text-black mb-1">Current Medications</h2><p className="text-sm text-black/60">Prescription analysis and interactions</p></div>
                <div className="space-y-3">
                  {medications.map((medication, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="p-4">
                         <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0"><Pill className="w-4 h-4 text-blue-600" /></div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-black truncate">{medication.name}</h3>
                              <p className="text-xs text-black/60 mt-1">Dosage: {medication.dosage}</p>
                              <p className="text-xs text-black/60">Notes: {medication.notes}</p>
                            </div>
                          </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'recommendations' && (
              <motion.div key="recommendations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                <div><h2 className="text-xl font-black text-black mb-1">Medical Recommendations</h2><p className="text-sm text-black/60">Suggested actions and follow-up care</p></div>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                          <p className="text-sm text-black font-medium">{rec}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
             {activeTab === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                <div><h2 className="text-xl font-black text-black mb-1">Document Summary</h2><p className="text-sm text-black/60">AI-generated summary with critical insights</p></div>
                <Card className="p-4"><CardHeader className="pb-3"><CardTitle className="flex items-center space-x-2 text-sm"><FileText className="w-4 h-4 text-blue-600" /><span>Executive Summary</span></CardTitle></CardHeader><CardContent><p className="text-sm text-black leading-relaxed">{summary.executiveSummary}</p></CardContent></Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle>Key Concerns</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-1">{summary.keyConcerns?.map((r, i) => <li key={i} className="text-sm">{r}</li>)}</ul></CardContent></Card>
                    <Card><CardHeader><CardTitle>Follow-Up Actions</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-1">{summary.followUpActions?.map((a, i) => <li key={i} className="text-sm">{a}</li>)}</ul></CardContent></Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-64 bg-white border-l border-black/10 p-3 flex flex-col max-h-[calc(100vh-64px)]">
          <div className="flex items-center space-x-1.5 mb-3 shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <h3 className="font-bold text-black" style={{ fontSize: '12px' }}>Medical Assistant</h3>
          </div>
          <div className="flex-1 space-y-3 mb-4 overflow-y-auto pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-6 h-full flex flex-col justify-center items-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-black/30" />
                <p className="text-xs">Ask about findings or recommendations</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-2.5 rounded-lg text-sm ${message.role === 'user' ? 'bg-black text-white ml-auto max-w-[85%]' : 'bg-black/5 text-black mr-auto max-w-[85%]'}`}>
                  <p>{message.message}</p>
                </motion.div>
              ))
            )}
          </div>
          <div className="space-y-2 mt-auto shrink-0">
            <Textarea placeholder="Ask a question..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className="min-h-[70px] text-sm" onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} />
            <Button onClick={handleSendMessage} className="w-full">Send</Button>
          </div>
        </div>
      </div>

      <Dialog open={showDocument} onOpenChange={setShowDocument}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>{data.fileName}</DialogTitle></DialogHeader>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap font-mono text-xs overflow-y-auto">{data.rawText}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}






