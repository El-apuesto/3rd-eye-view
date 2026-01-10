# 3rd Eye View

## AI-Powered Conspiracy Theory Analysis Platform

**3rd Eye View** is an open-source platform that leverages artificial intelligence to analyze conspiracy theories through evidence-based methodologies, historical pattern matching, and transparent analytical frameworks.

### 🎯 Mission

To provide a critical thinking tool that helps users evaluate conspiracy theories based on available evidence, historical patterns, and logical analysis—not to determine absolute truth, but to teach evidence evaluation and critical reasoning.

### ✨ Key Features

#### Analysis Methods
- **Multi-Tier Confidence System**: Categorizes theories as Verified, Strongly Supported, Plausible, Unverified, or Contradicted
- **Evidence-Based Scoring**: Evaluates quality and quantity of supporting evidence
- **Comparative Analysis**: Side-by-side comparison of official narratives vs. conspiracy theories

#### Evidence Tracking
- **Destroyed/Missing Evidence Tracker**: Flags when critical evidence has been destroyed or is unavailable
- **Official Investigation Quality Assessment**: Evaluates whether official investigations showed signs of obstruction
- **Timeline Tracking**: Monitors how long ago events occurred and declassification schedules
- **Historical Pattern Matching**: Compares theories to previously proven conspiracies (MK-ULTRA, COINTELPRO, etc.)

#### Intelligence Features
- **Motivational Analysis**: Examines why theories might exist (distraction, cover-up, psychological factors)
- **Counter-Narrative Analysis**: Identifies who benefits from both official and alternative narratives
- **Source Track Record System**: Weights sources based on historical accuracy
- **Real-Time Monitoring**: Tracks new evidence and developments

#### Transparency & Education
- **Open Source**: All code, methodology, and AI prompts are publicly auditable
- **Educational Focus**: Teaches critical thinking and evidence evaluation
- **Community Contribution**: Users can submit evidence and challenge analyses
- **User-Adjustable Bias Controls**: Adjust weighting of different source types

### 🏗️ Architecture

#### Tech Stack
- **Frontend**: React with Material-UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Engine**: Anthropic Claude API
- **Search Integration**: Google Custom Search, Bing Search API

#### Project Structure
```
3rd-eye-view/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   │   ├── aiAnalysis.js      # AI analysis engine
│   │   ├── searchEngine.js    # Web search integration
│   │   ├── evidenceTracker.js # Evidence tracking
│   │   └── patternMatcher.js  # Historical pattern matching
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── database/             # Database schemas and migrations
└── docs/                 # Documentation
```

### 🚀 Getting Started

#### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- API Keys:
  - Anthropic Claude API
  - Google Custom Search API
  - Bing Search API (optional)

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/El-apuesto/3rd-eye-view.git
cd 3rd-eye-view
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

4. **Set up the database**
```bash
psql -U your_user -d postgres -f database/schema.sql
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 📖 Usage

#### Analyzing a Theory
1. Search for a conspiracy theory or browse trending theories
2. Select your preferred analysis method (or run all three)
3. Adjust source weighting based on your preferences
4. Review the evidence, confidence scores, and historical patterns
5. Examine the motivational analysis and counter-narratives

#### Contributing Evidence
1. Navigate to any theory's detail page
2. Click "Submit Evidence"
3. Provide source URLs, descriptions, and evidence type
4. Community can vote on evidence quality

### 🛡️ Ethical Framework

#### Core Principles
1. **Transparency**: All methodology, code, and reasoning is open and auditable
2. **Humility**: We analyze evidence; we don't determine cosmic truth
3. **Education**: Teach users to think critically, not what to think
4. **Empowerment**: Provide tools and information, not verdicts
5. **Community**: Distributed authority through crowdsourced evidence

#### Limitations
- This tool cannot determine absolute truth
- Analysis is limited to publicly available evidence
- AI models have inherent biases that we attempt to mitigate but cannot eliminate
- Some theories are unfalsifiable and beyond the scope of evidence-based analysis

### 🔍 Historical Context

This platform was inspired by documented cases where "conspiracy theories" later proved true:
- MK-ULTRA (CIA mind control experiments)
- COINTELPRO (FBI surveillance and disruption programs)
- Tuskegee Syphilis Experiment
- Operation Northwoods
- Gulf of Tonkin Incident
- NSA Mass Surveillance
- Iran-Contra Affair
- And many more...

Healthy skepticism of official narratives is historically justified, but must be balanced with evidence-based reasoning.

### 📊 Analysis Methodology

#### Confidence Scoring System
- **Verified (90-100%)**: Multiple credible sources, official documentation, declassified materials
- **Strongly Supported (70-89%)**: Significant evidence from credible sources, internal consistency
- **Plausible (40-69%)**: Some evidence, logical coherence, but gaps remain
- **Unverified (20-39%)**: Insufficient evidence, relies on speculation
- **Contradicted (0-19%)**: Evidence actively disputes the theory

#### Evidence Quality Ratings
- Primary sources (documents, recordings) > Secondary sources (journalism) > Tertiary sources (blogs)
- Government documents > Corporate records > Personal testimony
- Verifiable facts > Interpretations > Speculation

#### Red Flags for Obstruction
- Destroyed or missing evidence
- Classified documents beyond normal timeframes
- Investigation leaders expressing doubts about their own conclusions
- Whistleblower retaliation
- Pattern matching to previously proven cover-ups

### 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

#### Ways to Contribute
- **Code**: Improve algorithms, add features, fix bugs
- **Evidence**: Submit sources and documentation
- **Analysis**: Challenge or refine existing analyses
- **Documentation**: Improve guides and explanations
- **Testing**: Report bugs and edge cases

### 📄 License

MIT License - See [LICENSE](LICENSE) for details.

### ⚠️ Disclaimer

This tool is for educational and research purposes. It provides analysis of available evidence but does not claim to determine absolute truth. Users should:
- Conduct their own research
- Examine original sources
- Think critically about all claims (including ours)
- Understand that absence of evidence is not evidence of absence
- Recognize that some truths may be unknowable with current information

### 🙏 Acknowledgments

- Built with Anthropic Claude for AI analysis
- Inspired by investigative journalists and whistleblowers who've exposed real conspiracies
- Dedicated to critical thinkers everywhere who question narratives responsibly

---

**Remember**: The goal isn't to tell you what's true—it's to teach you how to evaluate evidence and think critically. Question everything, including this tool.
