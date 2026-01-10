# 3rd Eye View

## AI-Powered Conspiracy Theory Analysis Platform

3rd Eye View is an open-source application that searches, analyzes, and tracks conspiracy theories using AI-powered evidence-based analysis. The platform provides transparent, multi-perspective evaluation of conspiracy theories with a focus on documented evidence and historical patterns.

## 🎯 Core Mission

To provide transparent, evidence-based analysis of conspiracy theories while:
- Tracking and ranking theories by popularity and research depth
- Evaluating evidence quality and source credibility
- Identifying patterns matching historically proven conspiracies
- Maintaining radical transparency in methodology
- Empowering users with critical thinking tools

## 🌟 Key Features

### Analysis Capabilities
- **Multi-Tier Confidence System**: Verified, Strongly Supported, Plausible, Unverified, Contradicted
- **Evidence-Based Scoring**: Pure evidence quality analysis without oversimplified verdicts
- **Comparative Analysis**: Side-by-side comparison of official narratives vs conspiracy theories
- **Motivational Analysis**: Examine WHY theories exist (distraction, cover-up, psychological factors)
- **Counter-Narrative Analysis**: Identify who benefits from each narrative
- **Historical Pattern Matching**: Compare to proven conspiracies (MK-ULTRA, COINTELPRO, etc.)

### Evidence Tracking
- **Destroyed Evidence Tracker**: Flag when evidence has been destroyed, sealed, or missing
- **Investigation Quality Assessment**: Evaluate official investigations for adequacy and obstruction signs
- **Timeline Tracking**: Monitor time elapsed and declassification possibilities
- **Declassification Monitor**: Track theories that may be verified when documents are released

### Bias Management
- **Source Diversity Weighting**: Transparent inclusion of diverse sources across spectrum
- **Track Record System**: Historical accuracy scoring for sources
- **User-Adjustable Controls**: Customize source weighting based on personal assessment

### User Features
- Search and browse theories by category and popularity
- Submit theories for analysis
- Compare multiple theories side-by-side
- Save and track theories
- View historical analysis changes
- Pattern recognition alerts
- Real-time evidence updates

### Transparency & Ethics
- **Radical Transparency**: Open-source code and methodology
- **Educational Focus**: Critical thinking tools and tutorials
- **Honest Disclaimers**: Clear statements of limitations
- **Community Contribution**: Crowdsourced evidence and challenges

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: Anthropic Claude API
- **Search**: Multiple search API integrations

### Frontend
- **Framework**: React
- **UI Components**: Modern responsive design
- **Data Visualization**: Charts and graphs for evidence analysis

## 📋 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Anthropic API key
- Search API keys (Google Custom Search, etc.)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/El-apuesto/3rd-eye-view.git
cd 3rd-eye-view
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

5. **Set up database**
```bash
psql -U postgres -f database/schema.sql
```

6. **Start the application**

Backend:
```bash
cd backend
npm start
```

Frontend (in new terminal):
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

See `.env.example` for all configuration options including:
- Database connection
- API keys for AI analysis
- Search engine API credentials
- Server ports and settings

## 📖 Usage Guide

### Analyzing a Theory

1. **Search**: Enter keywords to find existing theories or search the web
2. **Select Analysis Method**: Choose from:
   - Multi-Tier Confidence System
   - Evidence-Based Scoring
   - Comparative Analysis (or run all three)
3. **Adjust Bias Controls**: Customize source weighting if desired
4. **Review Results**: See detailed evidence, sources, and reasoning
5. **Contribute**: Submit additional evidence or challenges

### Understanding Confidence Ratings

- **Verified**: Documented proof, declassified documents, judicial findings
- **Strongly Supported**: Significant evidence from credible sources
- **Plausible**: Some evidence exists, but incomplete
- **Unverified**: Insufficient evidence to make determination
- **Contradicted**: Available evidence contradicts the theory

### Evidence Quality Indicators

- 🔴 **Destroyed Evidence**: Evidence known to have been destroyed
- 🟡 **Investigation Issues**: Official investigation showed signs of obstruction
- 🟢 **Strong Documentation**: Primary sources, multiple corroborating evidence
- 🔵 **Pattern Match**: Similar to historically proven conspiracies

## 🤝 Contributing

We welcome contributions! This is a community-driven project.

### Ways to Contribute

1. **Submit Evidence**: Add sources and documentation for existing theories
2. **Code Contributions**: Submit PRs for features, bug fixes, improvements
3. **Challenge Analysis**: Question conclusions and provide counter-evidence
4. **Documentation**: Improve guides, tutorials, and explanations
5. **Testing**: Help identify bugs and edge cases

### Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## ⚖️ Ethical Framework

### Our Principles

1. **Transparency Over Authority**: Show our work, don't demand trust
2. **Evidence Over Ideology**: Focus on documentable facts, not political bias
3. **Humility About Uncertainty**: Acknowledge what we cannot know
4. **Education Over Verdicts**: Teach critical thinking, not just provide answers
5. **Community Over Gatekeeping**: Distributed contribution, not centralized control

### What This Tool Is NOT

- ❌ An arbiter of absolute truth
- ❌ A replacement for critical thinking
- ❌ Politically biased toward any ideology
- ❌ A comprehensive encyclopedia of all theories
- ❌ Perfect or infallible

### What This Tool IS

- ✅ An evidence analysis framework
- ✅ A critical thinking educational tool
- ✅ A transparent, auditable system
- ✅ A community-driven investigation platform
- ✅ Open to challenge and improvement

## 📊 Historical Context

This project was inspired by research showing that many conspiracy theories about government wrongdoing have been proven true through declassification and investigation, including:

- MK-ULTRA (CIA mind control experiments)
- COINTELPRO (FBI surveillance of activists)
- Operation Northwoods (proposed false flag attacks)
- Gulf of Tonkin (false justification for Vietnam War)
- Iran-Contra Affair (illegal weapons sales)
- NSA Mass Surveillance (revealed by Snowden)
- Watergate (presidential conspiracy)
- And many more...

Given this pattern, the goal is to apply similar analytical rigor to current theories while maintaining intellectual honesty about uncertainty.

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details.

This project is open-source to ensure transparency and prevent any single entity from controlling the narrative.

## 🔗 Links

- **Documentation**: [Full docs](docs/)
- **API Reference**: [API docs](docs/api.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## 📧 Contact

For questions, concerns, or collaboration:
- Open an issue on GitHub
- Join our community discussions

## 🙏 Acknowledgments

This project stands on the shoulders of:
- Investigative journalists who uncovered historical conspiracies
- Whistleblowers who revealed government wrongdoing
- Researchers who documented evidence
- The open-source community

## ⚠️ Disclaimer

This tool analyzes available evidence; it cannot determine absolute truth. Users should:
- Verify sources independently
- Think critically about all claims
- Consider multiple perspectives
- Recognize the limitations of any analysis system

The presence of evidence does not prove a theory true, and absence of evidence does not prove a theory false. Truth is often complex, multifaceted, and evolving.

---

**Built with transparency. Powered by evidence. Driven by community.**