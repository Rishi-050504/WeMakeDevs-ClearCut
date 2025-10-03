**ClearCut: AI-Powered Document Intelligence**
Hey **WeMakeDevs** Team & Judges! 👋
Welcome to ClearCut. We're a team of four developers who believe that in an age of information overload, clarity is a superpower.
We built this project for your FutureStack '25 hackathon to tackle a problem we've all faced: wrestling with dense, complex documents.

🎯 **Potential Impact:** From Information Overload to Actionable Intelligence
We've all been there. A 50-page legal contract, a patient's entire medical history, a detailed business report. 
The answers you need are in there, but finding them is overwhelming and time-consuming. This friction costs time, money, and can lead to critical mistakes.

**ClearCut** is our answer. It's a versatile, AI-powered platform that ingests complex documents from the Legal, Medical, and General domains and transforms them into interactive, intelligent dashboards. 
It's not just a document viewer; it's an intelligence engine that highlights risks, summarizes key points, and answers your specific questions.
We built ClearCut to give professionals, patients, and students the power to make informed decisions, fast.

**Features**
**Multi-Domain Analysis**: Tailored analysis pipelines for Legal, Medical, and General documents.
**High-Speed AI Core**: Powered by Meta's Llama 3.3 70B model via the Cerebras API for rapid, structured JSON data extraction.
**Creative Docker Architectur**e: A unique, event-driven microservices architecture managed by a custom Docker MCP Gateway that spins up containerized tools on-demand.
**RAG-Powered AI Assistant**: Context-aware chat functionality for each document, backed by a Qdrant vector database to prevent hallucinations and provide accurate answers.
**Interactive UI**: A polished, responsive frontend built with React, Vite, and TypeScript, designed from Figma mockups.
**Secure Authentication**: End-to-end user authentication with JWT (JSON Web Tokens).
**Downloadable Reports**: Dynamically generated text summaries of all AI findings for each document.

**Tech Stack**
**Frontend**:	React, Vite, TypeScript, Tailwind CSS, Framer Motion
**Backend**:	Node.js, Express.js, TypeScript
**AI / ML**:	Cerebras API (Llama 3.3 70B), Qdrant (Vector DB), @xenova/transformers (Embeddings), RAG Pipeline
**Database**:	MongoDB,Qdrant
**DevOps**:	Docker, Docker Compose

**Data Flow**:
A user uploads a document.
The main Backend API performs a "fast path" analysis using the Cerebras API to immediately populate the UI.
Simultaneously, the API sends requests for deeper analysis to the MCP Gateway.
The Gateway identifies the required tool (e.g., entity-extractor) and uses docker run --rm to spin up a dedicated, containerized microservice for that single task.
The microservice performs its job and is instantly destroyed, saving system resources. This event-driven, "serverless-like" approach is a core feature of our design.

**Prerequisites**
Docker and Docker Compose installed
Node.js (v18 or later)
A .env file with your Cerebras API key.
**Clone the Repository**
git clone
cd clearcut-backend
**Configure Environment Variables**
cp .env.example .env
open .env file and add your CEREBRAS_API_KEY
**Run the script which has been predefined**
sh setup.sh --> creates necessary docker images and containers
sh start.sh --> starts the services
sh stop.sh --> stop the services
**Open terminal**
cd frontend
npm run dev --> opens the frontend

**Sponsor Technology Integration**
**Cerebras**: Our project's entire AI engine, from structured data extraction to RAG-powered chat, is built on the speed and power of the Cerebras API.
**Docker:** We've implemented a creative and highly efficient architecture using a custom Docker MCP Gateway that manages on-demand, containerized microservices.
**Meta:** We showcase an impactful and feature-rich generative AI application powered by Meta's Llama 3.3 70B model.

💡**Creativity & Originality**: A Hybrid Approach to AI Analysis
Our creative spark came from a simple realization: not all analysis is created equal. 
Sometimes you need an instant overview, and other times you need a deep, specialized dive. 
A monolithic AI backend just can’t do both efficiently.

Our novel approach is a hybrid analysis pipeline:
**The "Fast Path"**: We use a single, powerful call to the Cerebras API running Meta's Llama 3.3 to perform a high-speed initial analysis. 
This returns a structured JSON object that instantly populates the entire UI, giving the user immediate value.
**The "Deep Dive"**: In the background, we trigger a suite of specialized microservices for more nuanced tasks like entity extraction or timeline building.
This hybrid model ensures a snappy user experience while still providing deep, multi-faceted insights, which we believe is a unique and creative way to apply sponsor technologies.

⚙️ **Technical Implementation**: How We Built It
We're proud of the technical execution of ClearCut. It's a robust, scalable, and fully containerized full-stack application.
**Our Docker Innovation: The MCP Gateway**
The heart of our backend is a custom Docker MCP Gateway—our solution to utilise Docker. Traditional microservices are always-on, consuming resources even when idle. 
Our approach is different:
**On-Demand Services:** Our gateway acts as a "job dispatcher." When a specific task is needed (like entity-extraction), it uses a docker run --rm command to spin up a dedicated, lightweight container for that job only.
**Event-Driven & Serverless-like:** The container performs its single task, streams the result, and is instantly destroyed.
**Efficiency & Scalability:** This is incredibly resource-efficient and allows us to easily add new, independent AI tools without changing the core architecture. It's a creative and powerful use of Docker for event-driven AI processing.

🌱 **Learning & Growth**
As a team, this hackathon was a huge journey for us. We pushed ourselves far beyond basic web development. We dove headfirst into a complex, modern stack, learning and implementing:
A full microservices architecture from scratch.
**The Model Context Protocol (MCP)** to standardize communication with our tools.
An end-to-end **Retrieval-Augmented Generation (RAG)** pipeline with Qdrant for vector search.
Advanced AI prompting techniques to generate reliable, structured JSON.
This project represents a significant leap in our skills and our understanding of building production-ready AI systems.

🎨 **Aesthetics & User Experience**
We believe a powerful tool should also be a pleasure to use. We didn't just want a functional backend; we wanted a polished and intuitive user experience.
**User Driven Design**: Our UI is based on a detailed design tailored to suit all kinds of users, ensuring a clean, professional, and consistent look and feel.
**Interactive Dashboards**: Instead of a wall of text, users get interactive cards, gauges, and color-coded badges that make complex information easy to digest.
**Smooth Transitions**: We used Framer Motion to add subtle animations that guide the user and make the application feel responsive and alive.

🔮 Future Enhancements
ClearCut is a powerful foundation, and we're excited about where it could go next.
**Cloud Storage Integration**: Allow users to connect their Google Drive, Dropbox, or OneDrive accounts to analyze documents directly from the cloud.
**Collaborative Features**: Enable teams to share, comment on, and discuss document analyses in real-time.
**Advanced RAG**: Implement re-ranking of vector search results to provide even more accurate context to the AI assistant.
**Customizable Dashboards**: Allow users to create and save custom dashboard layouts for specific types of documents they analyze frequently.
**Custom Voice Agent**: Building real time voice agents to communicate with our product.
Thank you for your time and for this incredible opportunity!

-The ClearCut Team (Rishi, Sravya, Moksha, and Rithvik)
