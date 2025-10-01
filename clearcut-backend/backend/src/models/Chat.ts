import mongoose, { Document, Schema } from 'mongoose';

interface Citation {
  text: string;
  startIndex: number;
  endIndex: number;
  relevanceScore: number;
  chunkIndex: number;
}

export interface IChatMessage extends Document {
  documentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  citations: Citation[];
  retrievedChunks?: number;
  confidence?: number;
  responseTime?: number;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    citations: [
      {
        text: String,
        startIndex: Number,
        endIndex: Number,
        relevanceScore: Number,
        chunkIndex: Number,
      },
    ],
    retrievedChunks: Number,
    confidence: Number,
    responseTime: Number,
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ documentId: 1, createdAt: -1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);