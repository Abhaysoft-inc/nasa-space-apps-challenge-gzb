# 🌟 NASA Space Biology Knowledge Engine
### *Transforming 30 Years of Space Research into an Interactive Universe*

[![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA%20Space%20Apps-2025-blue?style=for-the-badge&logo=nasa)](https://spaceappschallenge.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-orange?style=for-the-badge&logo=three.js)](https://threejs.org)
[![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=openai)](https://openai.com)

## 🚀 **Project Overview**

An innovative **multimodal research platform** that revolutionizes how researchers interact with NASA's vast space biology database. Our platform combines cutting-edge 3D visualization, AI-powered research assistance, and interactive exploration tools to make scientific discovery more intuitive and engaging.

### 🎯 **The Challenge**
NASA has accumulated decades of crucial space biology research, but navigating this vast knowledge base is complex and time-consuming for researchers, students, and the public.

### 💡 **Our Solution**
A comprehensive platform that transforms complex research data into an engaging, explorable experience through advanced visualization, AI assistance, and gamification.

---

## ✨ **Key Features**

### 🌌 **3D Interactive Universe**
- **Stellar Visualization**: Each research paper represented as a glowing star with custom shaders
- **Citation Networks**: Visual connections showing research relationships and influences
- **Cosmic Environment**: Immersive space setting with 8000+ background stars
- **Smooth Navigation**: Orbital controls with auto-rotation and intuitive zoom
- **Real-time Interactions**: Click, hover, and explore papers in 3D space

### 🤖 **AI-Powered Research Assistant**
- **Contextual Chatbots**: Intelligent assistants on every page with paper-specific knowledge
- **Multimodal RAG System**: Advanced retrieval using both text and image content
- **Research Gap Finder**: AI identifies underexplored areas in space biology
- **Paper Summarization**: Automatic generation of comprehensive research summaries
- **Conversation Memory**: Maintains context across chat interactions

### 📊 **Advanced Analytics & Visualization**
- **Research Gap Dashboard**: Modern interface for identifying research opportunities
- **Paper Comparison Tool**: Side-by-side analysis with AI-powered insights
- **Interactive Heatmaps**: Visual representation of research intensity across disciplines
- **Timeline Explorer**: Navigate through 30+ years of space biology evolution
- **Category Filtering**: Explore by Human Biology, Plant Biology, Microbiology, and more

### 🎮 **Gamified Exploration**
- **Space-themed Games**: Tardigrade survival game and interactive missions
- **Achievement System**: Progress tracking and exploration rewards
- **Mission Center**: Structured learning paths through research topics
- **User Profiles**: Personal research journey tracking with contribution heatmaps

### 🌐 **Modern Web Experience**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Dark/Light Themes**: Customizable interface preferences
- **Fast Performance**: Optimized rendering with 60fps smooth animations
- **Progressive Web App**: Installable with offline capabilities

---

## 🛠️ **Technology Stack**

### **Frontend**
```
├── Next.js 15          # React framework with App Router
├── React 18            # Component-based UI library
├── Three.js            # 3D graphics and WebGL rendering
├── React Three Fiber   # React integration for Three.js
├── Tailwind CSS        # Utility-first styling framework
├── Framer Motion       # Smooth animations and transitions
├── Heroicons           # Beautiful SVG icons
└── TypeScript          # Type-safe JavaScript development
```

### **Backend & AI**
```
├── FastAPI             # High-performance Python web framework
├── Google Gemini AI    # Advanced language model integration
├── Pinecone            # Vector database for semantic search
├── LangChain           # AI application development framework
├── Sentence Transformers # Text and image embedding models
├── PyMuPDF             # PDF processing and text extraction
└── CLIP Model          # Multi-modal image-text understanding
```

### **Data & Infrastructure**
```
├── Vector Embeddings   # Semantic search capabilities
├── Multimodal RAG      # Retrieval-Augmented Generation
├── Real-time APIs      # Live data synchronization
├── Responsive Design   # Cross-device compatibility
└── Progressive Web App # Native app-like experience
```

### **Development & Deployment**
```
├── Git Version Control # Collaborative development
├── ESLint & Prettier   # Code quality and formatting
├── Vercel Deployment   # Seamless CI/CD pipeline
└── Performance Monitoring # Real-time analytics
```

---

## 🚀 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.8+ (for AI backend)
- Git for version control

### **Frontend Setup**
```bash
# Clone the repository
git clone https://github.com/Abhaysoft-inc/nasa-space-apps-challenge-gzb.git
cd nasa-space-apps-challenge-gzb

# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Backend Setup (Optional)**
```bash
# Navigate to model API directory
cd model-api

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
export GOOGLE_API_KEY="your_gemini_api_key"
export PINECONE_API_KEY="your_pinecone_api_key"

# Start the API server
python run.py
```

### **Environment Variables**
Create a `.env.local` file in the client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

---

## 📱 **How to Use**

### **🌌 Exploring the 3D Universe**
1. **Launch the Platform**: Visit the homepage to enter the interactive universe
2. **Navigate Space**: Use mouse to rotate, zoom, and pan through the research cosmos
3. **Discover Papers**: Click on any glowing star to explore research details
4. **Follow Connections**: See how research builds upon previous work through citation networks
5. **Filter by Category**: Focus on specific research areas (Human Biology, Plant Biology, etc.)
6. **Time Travel**: Use the timeline to see research evolution over 30+ years

### **🤖 AI Research Assistant**
1. **Paper Analysis**: Ask questions about any research paper for detailed explanations
2. **Research Gaps**: Use the Gap Finder to identify unexplored research opportunities
3. **Paper Comparison**: Compare multiple papers side-by-side with AI insights
4. **Contextual Help**: Get assistance tailored to the current page you're viewing

### **🎮 Interactive Features**
1. **Games Center**: Play the Tardigrade survival game and other space-themed activities
2. **Mission Control**: Follow structured learning paths through research topics
3. **Profile System**: Track your research journey and exploration progress
4. **Floating Chatbot**: Access AI assistance from any page on the platform

### **� Advanced Analytics**
1. **Research Dashboard**: Modern interface for analyzing research trends
2. **Gap Analysis**: Identify underexplored areas in space biology
3. **Visual Heatmaps**: See research intensity across different disciplines
4. **Citation Networks**: Understand how research papers influence each other

---

## 🌟 **Key Innovations**

### **🎯 Unique Value Propositions**
- **First 3D Research Universe**: Transform complex data into explorable space
- **AI-Powered Discovery**: Intelligent research assistance with contextual understanding
- **Gamified Learning**: Make scientific exploration engaging and rewarding
- **Multimodal Understanding**: Process both text and images for comprehensive analysis

### **🔬 Technical Breakthroughs**
- **Custom 3D Shaders**: Realistic star visualizations with glowing effects
- **Advanced RAG System**: Semantic search across text and image content
- **Real-time Interactions**: Smooth 60fps performance with 600+ interactive objects
- **Contextual AI**: Chatbots that understand current page and conversation history

### **🌍 Real-World Impact**
- **Accelerate Research**: Help scientists discover relevant work faster
- **Identify Gaps**: Pinpoint unexplored areas in space biology
- **Education**: Make NASA research accessible to students and the public
- **Mission Support**: Aid in planning future Mars, Moon, and ISS missions

---

## � **Project Highlights**

### **📈 Metrics & Achievements**
- **600+ Research Papers**: Comprehensive space biology database
- **30+ Years**: Historical research timeline coverage
- **6 Major Categories**: Human Biology, Plant Biology, Microbiology, and more
- **Advanced AI Models**: Google Gemini, CLIP, and Sentence Transformers
- **Real-time Performance**: 60fps smooth interactions
- **Cross-platform**: Desktop, tablet, and mobile support

### **🎨 Visual Excellence**
- **Custom GLSL Shaders**: Realistic star glow and particle effects
- **Dynamic Animations**: Smooth transitions and micro-interactions
- **Responsive Design**: Beautiful experience across all devices
- **Modern UI**: Glass-morphism effects and clean aesthetics
- **Accessibility**: Built with inclusive design principles

### **🔧 Technical Excellence**
- **Scalable Architecture**: Modular design for easy expansion
- **Performance Optimized**: Efficient rendering and memory management
- **Type Safety**: Full TypeScript implementation
- **Modern Standards**: Latest web technologies and best practices
- **CI/CD Pipeline**: Automated testing and deployment

---

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines:

1. **Fork the Repository**: Create your own copy of the project
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**: Submit your changes for review

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

Built with passion by the **Abhaysoft Inc** team for NASA Space Apps Challenge 2025.

---

## 🔗 **Links & Resources**

- **Live Demo**: [nasa-space-biology.vercel.app](https://nasa-space-biology.vercel.app)
- **GitHub Repository**: [github.com/Abhaysoft-inc/nasa-space-apps-challenge-gzb](https://github.com/Abhaysoft-inc/nasa-space-apps-challenge-gzb)
- **NASA Space Apps Challenge**: [spaceappschallenge.org](https://spaceappschallenge.org)
- **Project Documentation**: [docs.nasa-space-biology.com](https://docs.nasa-space-biology.com)

---

## 🌟 **Future Roadmap**

### **Phase 1: Enhanced AI**
- [ ] Advanced research recommendation engine
- [ ] Multi-language support for global accessibility
- [ ] Voice interaction capabilities
- [ ] Real-time collaboration features

### **Phase 2: Extended Reality**
- [ ] Virtual Reality (VR) support for immersive exploration
- [ ] Augmented Reality (AR) mobile companion
- [ ] Haptic feedback integration
- [ ] Spatial audio for enhanced immersion

### **Phase 3: Platform Evolution**
- [ ] Live NASA data integration
- [ ] Advanced analytics dashboard
- [ ] Community features and user-generated content
- [ ] Enterprise research tools

---

**🚀 Making space biology research as exciting as exploring the cosmos itself!**

*Built with ❤️ for NASA Space Apps Challenge 2025*