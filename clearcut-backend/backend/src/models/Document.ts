import mongoose, { Document as MongoDoc, Schema } from 'mongoose';

export interface IDocument extends MongoDoc {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize: number;
  mimeType: string;
  docType: 'Legal' | 'Medical' | 'Business' | 'General';
  rawText: string;
  
  analysis: {
    riskScore: number;
    keyClauses: string[];
    obligations: string[];
    recommendations: string[];
    sentiment: number;
    summary: string;
    analysisTime: number;
  };
  
  mcpResults: {
    legalAnalysis?: any;
    entities?: any;
    timeline?: any;
    compliance?: any;
    orchestrationTime?: number;
  };
  
  vectorStoreId: string;
  chunkCount: number;
  indexed: boolean;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    docType: {
      type: String,
      enum: ['Legal', 'Medical', 'Business', 'General'],
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    analysis: {
      riskScore: Number,
      keyClauses: [String],
      obligations: [String],
      recommendations: [String],
      sentiment: Number,
      summary: String,
      analysisTime: Number,
    },
    mcpResults: {
      type: Schema.Types.Mixed,
      default: {},
    },
    vectorStoreId: String,
    chunkCount: { type: Number, default: 0 },
    indexed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['uploading', 'processing', 'completed', 'failed'],
      default: 'uploading',
    },
    error: String,
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ status: 1 });
documentSchema.index({ vectorStoreId: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);