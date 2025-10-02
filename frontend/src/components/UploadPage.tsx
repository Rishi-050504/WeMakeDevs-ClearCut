import { motion } from 'motion/react';
import { useState } from 'react';
import { Upload, Camera, Link as LinkIcon, FileText, Heart, Scale, Menu, Check } from 'lucide-react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from './ui/all-components';
import { Header } from './Header';
import { documentAPI } from '../services/api';
import { extractText } from '../utils/text-extractor';

interface UploadPageProps {
  onUpload: (type: 'medical' | 'legal' | 'general', file: File | null, context: string) => void;
  onLogout: () => void;
  onViewAnalytics: () => void;
}

export function UploadPage({ onUpload, onLogout, onViewAnalytics }: UploadPageProps) {
  const [selectedTab, setSelectedTab] = useState<'medical' | 'legal' | 'general'>('medical');
  const [context, setContext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsUploaded(true);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) return;
  
  try {
    // Extract text from file (you'll need to implement this)
    const rawText = await extractTextFromFile(selectedFile);
    
    const response = await documentAPI.analyze({
      fileName: selectedFile.name,
      mimeType: selectedFile.type,
      rawText,
      docType: selectedTab === 'medical' ? 'Medical' : 
               selectedTab === 'legal' ? 'Legal' : 'General',
    });
    
    if (response.data.success) {
      // Pass to parent
      onUpload(
        selectedTab,
        selectedFile,
        context
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    alert(error.response?.data?.message || 'Upload failed');
  }
};
async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    // For PDF/DOCX, you'd need additional processing
    // For now, just read as text
    reader.readAsText(file);
  });
}

  const uploadOptions = [
    { icon: Upload, label: 'Browse Files', action: 'browse' },
    { icon: Camera, label: 'Take Photo', action: 'camera' },
    { icon: LinkIcon, label: 'From URL', action: 'url' }
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Custom Header with Menu */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-2 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-black" strokeWidth={2} />
          <h1 
            className="text-2xl font-black text-black"
            style={{ fontFamily: 'Cooper Black, serif' }}
          >
            ClearCut
          </h1>
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
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <button
                onClick={() => {
                  onViewAnalytics();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                Analytics
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-black text-black mb-1" style={{ fontSize: '24px' }}>Upload Document</h1>
          <p className="text-black/60 mb-4 md:mb-5" style={{ fontSize: '13px' }}>Select document type and upload your file for analysis</p>

          {/* Document Type Selection */}
          <div className="mb-5">
            <h2 className="font-black text-black mb-4 flex items-center" style={{ fontSize: '16px' }}>
              <span className="mr-2">Step 1: Select Document Type</span>
              <span style={{ fontSize: '14px' }}>✨</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Medical Documents */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedTab('medical')}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedTab === 'medical'
                    ? 'border-red-300 bg-red-50/70 shadow-xl backdrop-blur-sm'
                    : 'border-black/10 bg-white/70 hover:border-red-200 hover:bg-red-50/30 backdrop-blur-sm'
                }`}
                style={{
                  background: selectedTab === 'medical' 
                    ? 'rgba(254, 242, 242, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="text-center space-y-3">
                  <div className={`inline-flex p-3 rounded-full ${
                    selectedTab === 'medical' ? 'bg-red-100' : 'bg-black/5'
                  }`}>
                    <Heart className={`w-6 h-6 ${
                      selectedTab === 'medical' ? 'text-red-600' : 'text-black/60'
                    }`} />
                  </div>
                  <h3 className="font-black text-black" style={{ fontSize: '16px' }}>Medical Reports</h3>
                  <p className="text-black/60" style={{ fontSize: '12px' }}>Lab results, diagnostic reports, medical imaging</p>
                  {selectedTab === 'medical' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center space-x-2 text-red-600"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-red-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      </div>
                      <span className="font-medium" style={{ fontSize: '12px' }}>Selected</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Legal Documents */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedTab('legal')}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedTab === 'legal'
                    ? 'border-blue-300 bg-blue-50/70 shadow-xl backdrop-blur-sm'
                    : 'border-black/10 bg-white/70 hover:border-blue-200 hover:bg-blue-50/30 backdrop-blur-sm'
                }`}
                style={{
                  background: selectedTab === 'legal' 
                    ? 'rgba(239, 246, 255, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="text-center space-y-3">
                  <div className={`inline-flex p-3 rounded-full ${
                    selectedTab === 'legal' ? 'bg-blue-100' : 'bg-black/5'
                  }`}>
                    <Scale className={`w-6 h-6 ${
                      selectedTab === 'legal' ? 'text-blue-600' : 'text-black/60'
                    }`} />
                  </div>
                  <h3 className="font-black text-black" style={{ fontSize: '16px' }}>Legal Documents</h3>
                  <p className="text-black/60" style={{ fontSize: '12px' }}>Contracts, agreements, terms of service</p>
                  {selectedTab === 'legal' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center space-x-2 text-blue-600"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="font-medium" style={{ fontSize: '12px' }}>Selected</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* General Documents */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedTab('general')}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedTab === 'general'
                    ? 'border-green-300 bg-green-50/70 shadow-xl backdrop-blur-sm'
                    : 'border-black/10 bg-white/70 hover:border-green-200 hover:bg-green-50/30 backdrop-blur-sm'
                }`}
                style={{
                  background: selectedTab === 'general' 
                    ? 'rgba(240, 253, 244, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="text-center space-y-3">
                  <div className={`inline-flex p-3 rounded-full ${
                    selectedTab === 'general' ? 'bg-green-100' : 'bg-black/5'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      selectedTab === 'general' ? 'text-green-600' : 'text-black/60'
                    }`} />
                  </div>
                  <h3 className="font-black text-black" style={{ fontSize: '16px' }}>General Documents</h3>
                  <p className="text-black/60" style={{ fontSize: '12px' }}>Research papers, reports, proposals</p>
                  {selectedTab === 'general' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center space-x-2 text-green-600"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="font-medium" style={{ fontSize: '12px' }}>Selected</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full">
            <div className="hidden">
              <TabsList className="grid w-full grid-cols-3 bg-black/5 p-1">
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="medical" className="mt-5 space-y-4">
              <UploadContent 
                type="medical"
                options={uploadOptions}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                context={context}
                onContextChange={setContext}
                onUpload={handleUpload}
              />
            </TabsContent>

            <TabsContent value="legal" className="mt-5 space-y-4">
              <UploadContent 
                type="legal"
                options={uploadOptions}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                context={context}
                onContextChange={setContext}
                onUpload={handleUpload}
              />
            </TabsContent>

            <TabsContent value="general" className="mt-5 space-y-4">
              <UploadContent 
                type="general"
                options={uploadOptions}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                context={context}
                onContextChange={setContext}
                onUpload={handleUpload}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

interface UploadContentProps {
  type: string;
  options: Array<{ icon: any; label: string; action: string }>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  context: string;
  onContextChange: (value: string) => void;
  onUpload: () => void;
}

function UploadContent({ 
  type, 
  options, 
  onFileSelect, 
  selectedFile, 
  context, 
  onContextChange, 
  onUpload 
}: UploadContentProps) {
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileSelectWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e);
    if (e.target.files && e.target.files[0]) {
      setIsUploaded(true);
    }
  };

  return (
    <>
      {/* Upload Options */}
      <div className={`border-2 border-dashed rounded-lg p-4 md:p-8 transition-all ${isUploaded ? 'border-green-300 bg-green-50' : 'border-black/20'}`}>
        <div className="text-center space-y-4">
          {!isUploaded ? (
            <div className="flex flex-col md:flex-row justify-center gap-4 md:space-x-4">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <label 
                    key={option.action}
                    className="flex flex-col items-center space-y-2 cursor-pointer p-4 md:p-6 border border-black/10 hover:border-black/30 hover:bg-black/5 transition-all duration-300 rounded-lg w-full md:w-auto"
                  >
                    {option.action === 'browse' && (
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelectWrapper}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    )}
                    <Icon className="w-8 h-8 text-black" />
                    <span className="text-sm text-black">{option.label}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-16 h-20 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="font-medium text-black">{selectedFile?.name}</p>
                <p className="text-sm text-green-600 mt-1">
                  <Check className="w-4 h-4 inline mr-1" />
                  File uploaded successfully
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Additional Context */}
      <div className="space-y-1.5">
        <label className="font-medium text-black" style={{ fontSize: '13px' }}>
          Additional Context (Optional)
        </label>
        <Textarea
          placeholder="Add any additional information that might help with the analysis..."
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          className="min-h-[100px] border-black/20"
          style={{ fontSize: '13px' }}
        />
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button
          onClick={onUpload}
          disabled={!selectedFile}
          className="bg-black text-white hover:bg-black/90 py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          style={{ fontSize: '13px' }}
        >
          Analyze {type.charAt(0).toUpperCase() + type.slice(1)} Document
        </Button>
      </div>
    </>
  );
}