# ClearCut Backend

Production-ready document analysis backend with AI-powered insights.

## Features

- 🔥 **Cerebras Integration**: Ultra-fast LLM inference (1,800 tokens/sec)
- 🦙 **Meta Llama 3.3 70B**: Advanced RAG with structured outputs
- 🐳 **Docker MCP Gateway**: Orchestrated AI microservices
- 📊 **Vector Search**: Semantic document search with Qdrant
- 🔐 **Authentication**: JWT-based secure API
- 📈 **Analytics**: Document processing metrics

## Quick Start

### Prerequisites

- Docker Desktop installed
- Node.js 18+ (for development)
- Cerebras API key

### Installation

1. Clone repository
```bash
git clone <repo-url>
cd clearcut-backend

┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
┌──────▼──────────┐
│  Express API    │
│  (Port 3000)    │
└───┬─────────┬───┘
    │         │
    │    ┌────▼────────┐
    │    │ MCP Gateway │
    │    │ (Port 8811) │
    │    └────┬────────┘
    │         │
    │    ┌────▼─────────────────┐
    │    │  MCP Servers         │
    │    │  - Document Analyzer │
    │    │  - Entity Extractor  │
    │    │  - Timeline Builder  │
    │    │  - Legal Analyzer    │
    │    └──────────────────────┘
    │
┌───▼──────┐  ┌─────────┐
│ MongoDB  │  │ Qdrant  │
│ (27017)  │  │ (6333)  │
└──────────┘  └─────────┘