import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Download, 
  Eye, 
  Flag, 
  Users, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  X, 
  Menu, 
  ArrowLeft,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Calendar,
  Target,
  Lightbulb,
  BarChart
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/all-components';

interface GeneralAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
   onViewPostSummary: () => void; 
}

export function GeneralAnalysisPage({ onLogout, onBack, onViewAnalytics }: GeneralAnalysisPageProps) {
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
          message: 'Based on the document analysis, I can help you understand the key points and provide insights about the content. The document contains several important actionable items with varying priority levels.' 
        }]);
      }, 1000);
      setChatMessage('');
    }
  };

  const generalData = {
    priorityLevel: 6,
    documentInfo: {
      title: "Quarterly Business Review Report",
      type: "Business Report",
      created: "December 15, 2024",
      pages: 12,
      wordCount: 3420
    },
    summary: {
      sentiment: "Positive",
      readabilityScore: 8.5,
      complexity: "Medium",
      category: "Business Analysis"
    },
    keyPoints: [
      { 
        point: "Revenue increased by 23% this quarter", 
        priority: "high",
        category: "Financial Performance",
        confidence: 95
      },
      { 
        point: "Customer satisfaction scores improved", 
        priority: "medium",
        category: "Customer Relations",
        confidence: 87
      },
      { 
        point: "New product launch scheduled for Q2", 
        priority: "high",
        category: "Product Development",
        confidence: 92
      },
      { 
        point: "Team expansion in engineering department", 
        priority: "medium",
        category: "Human Resources",
        confidence: 78
      }
    ],
    timeline: [
      { event: "Q4 Results Published", date: "Jan 15, 2024", status: "completed" },
      { event: "Board Review Meeting", date: "Jan 20, 2024", status: "upcoming" },
      { event: "Strategy Planning Session", date: "Feb 1, 2024", status: "planned" },
      { event: "Q1 Kickoff", date: "Feb 15, 2024", status: "planned" }
    ],
    insights: [
      "Document indicates strong business performance with positive growth trends",
      "Strategic initiatives are well-defined with clear timelines",
      "Key stakeholders are engaged and aligned on objectives",
      "Risk management strategies are adequately addressed"
    ],
    actionItems: [
      "Schedule follow-up meeting with stakeholders",
      "Prepare detailed implementation roadmap",
      "Review budget allocations for upcoming projects",
      "Update project timeline documentation"
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };
      case 'medium': return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" };
      case 'low': return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" };
      default: return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" };
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="w-4 h-4 text-red-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Star className="w-4 h-4 text-purple-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'planned': return <Calendar className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-black/60" />;
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'keypoints', label: 'Key Points', icon: Star },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">General Analysis</h1>
              <p className="text-xs text-black/60">Document insights & key findings</p>
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
        <div className="w-80 bg-white border-r border-black/10 p-6 max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Priority Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                    strokeDasharray={`${(generalData.priorityLevel / 10) * 251.2} 251.2`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-black text-black">{generalData.priorityLevel}</div>
                    <div className="text-xs text-black/60">/ 10</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1">Priority Level</h3>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
                {generalData.priorityLevel <= 3 ? 'Low Priority' : 
                 generalData.priorityLevel <= 6 ? 'Medium Priority' : 
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
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'bg-purple-50 border-purple-200 text-purple-800' 
                      : 'bg-white border-black/10 text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-black/60'}`} />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          {/* Document Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-black/5 rounded-lg"
          >
            <h4 className="font-bold text-black mb-3">Document Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Type:</span>
                <span className="font-medium text-black">{generalData.documentInfo.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Pages:</span>
                <span className="font-medium text-black">{generalData.documentInfo.pages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Words:</span>
                <span className="font-medium text-black">{generalData.documentInfo.wordCount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Sentiment Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <h4 className="font-bold text-black mb-2">Sentiment Analysis</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">{generalData.summary.sentiment}</span>
            </div>
            <p className="text-xs text-green-700 mt-1">Document tone is optimistic and constructive</p>
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
                  <h2 className="text-xl font-black text-black mb-1">Document Overview</h2>
                  <p className="text-sm text-black/60">Comprehensive analysis and content summary</p>
                </div>

                {/* Document Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <BarChart className="w-4 h-4 text-purple-600" />
                        <span>Readability</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black mb-1">
                        {generalData.summary.readabilityScore}/10
                      </div>
                      <p className="text-xs text-black/60">Excellent</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>Complexity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black mb-1">
                        {generalData.summary.complexity}
                      </div>
                      <p className="text-xs text-black/60">Easy to understand</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span>Key Points</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black mb-1">
                        {generalData.keyPoints.length}
                      </div>
                      <p className="text-xs text-black/60">Important findings</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <CheckSquare className="w-5 h-5 text-green-600" />
                        <span>Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-black mb-1">
                        {generalData.actionItems.length}
                      </div>
                      <p className="text-sm text-black/60">Required actions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-bold text-black mb-4">Document Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-black/60">Title:</span>
                        <span className="font-medium text-black">{generalData.documentInfo.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Created:</span>
                        <span className="font-medium text-black">{generalData.documentInfo.created}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Category:</span>
                        <span className="font-medium text-black">{generalData.summary.category}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-bold text-black mb-4">Analysis Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-black">Positive sentiment detected</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-black">Clear structure and organization</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-black">Actionable insights identified</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'keypoints' && (
              <motion.div
                key="keypoints"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">Key Points</h2>
                  <p className="text-black/60">Most important findings and insights</p>
                </div>

                <div className="space-y-4">
                  {generalData.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getPriorityIcon(point.priority)}
                            <div className="flex-1">
                              <h3 className="font-bold text-black">{point.point}</h3>
                              <p className="text-sm text-black/60 mt-1">Category: {point.category}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-black/60">Confidence:</span>
                                <div className="flex-1 bg-black/10 rounded-full h-2 max-w-24">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full" 
                                    style={{ width: `${point.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-black">{point.confidence}%</span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={point.priority === 'high' ? 'destructive' : 
                                    point.priority === 'medium' ? 'warning' : 'success'}
                          >
                            {point.priority} priority
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">Timeline</h2>
                  <p className="text-black/60">Important dates and milestones</p>
                </div>

                <div className="space-y-4">
                  {generalData.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(item.status)}
                            <div>
                              <h3 className="font-bold text-black">{item.event}</h3>
                              <p className="text-sm text-black/60 mt-1">{item.date}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={item.status === 'completed' ? 'success' : 
                                    item.status === 'upcoming' ? 'warning' : 'secondary'}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">AI Insights</h2>
                  <p className="text-black/60">Generated insights and action items</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-black">Key Insights</h3>
                    {generalData.insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-black font-medium">{insight}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-black">Action Items</h3>
                    {generalData.actionItems.map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <CheckSquare className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-black font-medium">{action}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-white border-l border-black/10 p-6 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black">Document Assistant</h3>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-black/30" />
                <p>Ask me about the document content, insights, or recommendations</p>
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
              placeholder="Ask about key points, insights, or actionable items..."
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
            <DialogTitle>Document Content</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-black/5 rounded-lg">
            <p className="text-black/60 mb-4">Original document content would be displayed here...</p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded border">
                <h4 className="font-bold text-black mb-2">{generalData.documentInfo.title}</h4>
                <p className="text-sm text-black/60">Complete document content and analysis results...</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}