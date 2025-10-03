import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  AlertTriangle,
  MessageSquare,
  Menu,
  ArrowLeft,
  FileText,
  CheckCircle,
  Loader2,
  Lightbulb,
  Star,
  Calendar,
  Badge as BadgeIcon,
  Flag,
  Clock,
  AlertCircle,
  BarChart,
  CheckSquare,
  Badge,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  CardHeader,
  CardTitle,
} from "./ui/all-components";
import { documentAPI, chatAPI } from "../services/api";

interface GeneralAnalysisPageProps {
  onLogout: () => void;
  onBack: () => void;
  onViewAnalytics: () => void;
  onViewPostSummary: () => void;
}

interface AnalysisData {
  fileName: string;
  rawText: string;
  analysis?: {
    priorityLevel?: number;
    documentInfo?: {
      title?: string;
      type?: string;
      created?: string;
      pages?: number;
    };
    keyPoints?: {
      point: string;
      category: string;
      priority: "high" | "moderate" | "low";
      confidence: number;
    }[];
    actionItems?: string[];
    timeline?: {
      event: string;
      date: string;
      status: "completed" | "upcoming" | "planned";
    }[];
    summary?: {
      executiveSummary?: string;
      mainInsights?: string[];
      nextSteps?: string[];
    };
  };
}

export function GeneralAnalysisPage({
  onLogout,
  onBack,
  onViewAnalytics,
}: GeneralAnalysisPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "ai"; message: string }>
  >([]);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    const documentId = sessionStorage.getItem("currentDocumentId");
    if (!documentId) {
      setError("No document ID found.");
      setIsLoading(false);
      return;
    }
    documentAPI
      .getById(documentId)
      .then((res) => {
        if (res.data.success && res.data.document.analysis) {
          setData(res.data.document);
        } else {
          setError(
            res.data.message || "Analysis data is missing or incomplete."
          );
        }
      })
      .catch(() => setError("Failed to fetch analysis from the server."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSendMessage = async () => {
    const documentId = sessionStorage.getItem("currentDocumentId");
    if (chatMessage.trim() && documentId) {
      const userMessage = { role: "user" as const, message: chatMessage };
      setChatHistory((prev) => [...prev, userMessage]);
      const currentInput = chatMessage;
      setChatMessage("");

      try {
        const response = await chatAPI.send({
          documentId,
          message: currentInput,
        });
        if (response.data.success) {
          const aiMessage = {
            role: "ai" as const,
            message: response.data.message,
          };
          setChatHistory((prev) => [...prev, aiMessage]);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        const errorMessage = {
          role: "ai" as const,
          message:
            "Sorry, I couldn't get a response. The AI assistant may be offline.",
        };
        setChatHistory((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleDownload = () => {
    const documentId = sessionStorage.getItem("currentDocumentId");
    const token = localStorage.getItem("auth_token");
    if (documentId && token) {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/api/documents/${documentId}/download`;
      fetch(downloadUrl, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (!response.ok) throw new Error("Download failed.");
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report-${data?.fileName || "document"}.txt`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => alert(err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">Loading Analysis...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div>
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }
  const analysis = data.analysis ?? {};
  const priorityLevel = analysis.priorityLevel ?? 65;
  const documentInfo = analysis.documentInfo ?? {
    title: data.fileName,
    type: "Business Report",
    pages: 12,
  };
  const keyPoints = analysis.keyPoints ?? [
    {
      point: "Revenue increased by 23%",
      category: "Financials",
      priority: "high",
      confidence: 95,
    },
  ];
  const actionItems = analysis.actionItems ?? [
    "Schedule follow-up meeting with stakeholders",
  ];
  const timeline = analysis.timeline ?? [
    { event: "Q4 Results Published", date: "2024-01-15", status: "completed" },
  ];
  const summary = analysis.summary ?? {
    executiveSummary: "This document outlines strong quarterly performance...",
    mainInsights: ["Positive growth trends noted."],
    nextSteps: ["Budget review for Q2 is the next step."],
  };
  const priorityLabel =
    priorityLevel > 66
      ? "High Priority"
      : priorityLevel > 33
        ? "Medium Priority"
        : "Low Priority";
  const getPriorityLevelDetails = (level: number) => {
    if (level <= 33)
      return {
        label: "Low Priority",
        className: "bg-green-100 text-green-800 border-green-300",
      };
    if (level <= 66)
      return {
        label: "Medium Priority",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    return {
      label: "High Priority",
      className: "bg-red-100 text-red-800 border-red-300",
    };
  };
  const priorityDetails = getPriorityLevelDetails(priorityLevel);
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="w-4 h-4 text-red-600" />;
      case "moderate":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Star className="w-4 h-4 text-purple-600" />;
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "upcoming":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "planned":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-black/60" />;
    }
  };
  const tabItems = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "keypoints", label: "Key Points", icon: Star },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "insights", label: "Insights & Actions", icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-black/10 bg-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-black hover:text-black hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
          </Button>
          <div className="h-6 w-px bg-black/20" />
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">
                General Analysis
              </h1>
              <p className="text-xs text-black/60">
                Document insights & key findings
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowDocument(true)}>
            <Eye className="w-4 h-4 mr-2" /> View Document
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download Report
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
        <div className="w-80 bg-white border-r border-black/10 p-6 max-h-[calc(100vh-64px)] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
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
                    strokeDasharray={`${(priorityLevel / 100) * 251.2} 251.2`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-black text-black">
                      {priorityLevel}
                    </div>
                    <div className="text-xs text-black/60">/ 100</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-black mb-1">Priority Level</h3>
              <Badge variant="secondary" className={priorityDetails.className}>
                {priorityDetails.label}
              </Badge>
            </div>
          </motion.div>

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
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all ${isActive ? "bg-purple-50 border-purple-200 text-purple-800" : "bg-white border-black/10 text-black hover:bg-black/5"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-black/60"}`}
                  />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

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
                <span className="font-medium text-black">
                  {documentInfo.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Pages:</span>
                <span className="font-medium text-black">
                  {documentInfo.pages}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Created:</span>
                <span className="font-medium text-black">
                  {new Date(
                    documentInfo.created || Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-black mb-1">
                    Executive Summary
                  </h2>
                  <p className="text-sm text-black/60">{documentInfo.title}</p>
                </div>
                <Card>
                  <CardContent className="p-4 text-sm">
                    {summary.executiveSummary}
                  </CardContent>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span>Key Points</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black">
                        {keyPoints.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <CheckSquare className="w-4 h-4 text-green-600" />
                        <span>Action Items</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black">
                        {actionItems.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Timeline Events</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black">
                        {timeline.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        <span>Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black text-black">
                        {summary.mainInsights?.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "keypoints" && (
              <motion.div
                key="keypoints"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">
                    Key Points
                  </h2>
                  <p className="text-black/60">
                    Most important findings from the document
                  </p>
                </div>
                <div className="space-y-4">
                  {keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="mt-1">
                              {getPriorityIcon(point.priority)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-black">
                                {point.point}
                              </h3>
                              <p className="text-sm text-black/60 mt-1">
                                Category: {point.category}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-black/60">
                                  Confidence:
                                </span>
                                <div className="flex-1 bg-black/10 rounded-full h-2 max-w-24">
                                  <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: `${point.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-black">
                                  {point.confidence}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              point.priority === "high"
                                ? "destructive"
                                : point.priority === "moderate"
                                  ? "warning"
                                  : "success"
                            }
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

            {activeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">
                    Timeline
                  </h2>
                  <p className="text-black/60">
                    Important dates and milestones
                  </p>
                </div>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
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
                              <h3 className="font-bold text-black">
                                {item.event}
                              </h3>
                              <p className="text-sm text-black/60 mt-1">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              item.status === "completed"
                                ? "success"
                                : item.status === "upcoming"
                                  ? "warning"
                                  : "secondary"
                            }
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

            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-black mb-2">
                    AI Insights & Actions
                  </h2>
                  <p className="text-black/60">
                    Generated insights and recommended next steps
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-black">Main Insights</h3>
                    {summary.mainInsights?.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg mt-1">
                              <Lightbulb className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-black">{insight}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-black">Action Items</h3>
                    {actionItems.map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Card className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 bg-green-100 rounded-lg mt-1">
                              <CheckSquare className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-black">{action}</p>
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

        <div className="w-96 bg-white border-l border-black/10 p-6 flex flex-col max-h-[calc(100vh-64px)]">
          <div className="flex items-center space-x-2 mb-6 shrink-0">
            <MessageSquare className="w-5 h-5 text-black" />
            <h3 className="font-bold text-black">Document Assistant</h3>
          </div>
          <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center text-black/60 py-8 h-full flex flex-col justify-center items-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-black/30" />
                <p>Ask me about the document content</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm ${message.role === "user" ? "bg-black text-white ml-auto max-w-[85%]" : "bg-black/5 text-black mr-auto max-w-[85%]"}`}
                >
                  <p>{message.message}</p>
                </motion.div>
              ))
            )}
          </div>
          <div className="space-y-3 mt-auto shrink-0">
            <Textarea
              placeholder="Ask about key points..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleSendMessage())
              }
            />
            <Button onClick={handleSendMessage} className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDocument} onOpenChange={setShowDocument}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{data.fileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap font-mono text-xs overflow-y-auto">
            {data.rawText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
