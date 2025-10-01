import { motion } from 'motion/react';
import { useState } from 'react';
import { FileText, Heart, Scale, TrendingUp, Calendar, Download, Eye, Menu, ArrowLeft } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui/all-components';

interface AnalyzedDocument {
  id: string;
  name: string;
  type: 'medical' | 'legal' | 'general';
  date: string;
  size: string;
}

interface AnalyticsPageProps {
  documents: AnalyzedDocument[];
  onLogout: () => void;
  onViewAnalytics: () => void;
  onBackToUpload: () => void;
}

export function AnalyticsPage({ documents, onLogout, onViewAnalytics, onBackToUpload }: AnalyticsPageProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'medical' | 'legal' | 'general'>('all');
  const [showMenu, setShowMenu] = useState(false);

  const documentTypes = [
    { key: 'all', label: 'All Documents', icon: FileText, count: documents.length },
    { key: 'medical', label: 'Medical', icon: Heart, count: documents.filter(d => d.type === 'medical').length },
    { key: 'legal', label: 'Legal', icon: Scale, count: documents.filter(d => d.type === 'legal').length },
    { key: 'general', label: 'General', icon: FileText, count: documents.filter(d => d.type === 'general').length }
  ];

  const filteredDocuments = selectedType === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-green-100 text-green-800 border-green-200';
      case 'legal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'general': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return Heart;
      case 'legal': return Scale;
      case 'general': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Header */}
      <nav className="bg-white border-b border-black/10 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToUpload}
              className="text-black/60 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
            <div className="h-6 w-px bg-black/20" />
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-black" strokeWidth={2} />
              <h1 
                className="text-2xl font-black text-black"
                style={{ fontFamily: 'Cooper Black, serif' }}
              >
                Analytics
              </h1>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg z-50"
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
        {/* Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-80 bg-white border-r border-black/10 p-6 max-h-[calc(100vh-64px)] overflow-y-auto"
        >
          <h2 className="font-bold text-lg text-black mb-6">Document Types</h2>
          
          <div className="space-y-3">
            {documentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.key;
              
              return (
                <motion.button
                  key={type.key}
                  onClick={() => setSelectedType(type.key as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'bg-white border-black/10 text-black hover:bg-black/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-black/60'}`} />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={isSelected ? 'bg-blue-100 text-blue-700' : 'bg-black/10 text-black/60'}
                  >
                    {type.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 p-4 bg-black/5 rounded-lg border border-black/10">
            <h3 className="font-semibold text-black mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Total Documents:</span>
                <span className="font-medium text-black">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">This Month:</span>
                <span className="font-medium text-black">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Most Used:</span>
                <span className="font-medium text-black">
                  {documentTypes.slice(1).reduce((prev, current) => 
                    prev.count > current.count ? prev : current
                  ).label}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 max-h-[calc(100vh-64px)] overflow-y-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {selectedType === 'all' ? 'All Documents' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Documents`}
                </h2>
                <p className="text-black/60 mt-1">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <Button
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="w-16 h-16 text-black/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black/60 mb-2">No documents found</h3>
                <p className="text-black/40">
                  {selectedType === 'all' 
                    ? 'Start by uploading your first document' 
                    : `No ${selectedType} documents have been analyzed yet`
                  }
                </p>
                <Button
                  onClick={onBackToUpload}
                  className="mt-4"
                >
                  Upload Document
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc, index) => {
                  const TypeIcon = getTypeIcon(doc.type);
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}`}>
                                <TypeIcon className="w-4 h-4" />
                              </div>
                              <Badge 
                                variant="outline"
                                className={getTypeColor(doc.type)}
                              >
                                {doc.type}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <h3 className="font-semibold text-black mb-2 truncate" title={doc.name}>
                            {doc.name}
                          </h3>
                          
                          <div className="space-y-2 text-sm text-black/60">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{doc.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>{doc.size}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}