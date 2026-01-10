# 3rd Eye View

## AI-Powered Conspiracy Theory Analysis Platform

3rd Eye View is an open-source application that searches, tracks, and analyzes conspiracy theories using advanced AI technology. The platform evaluates theories based on evidence quality, source credibility, historical patterns, and logical coherence.

## Features

### Core Functionality
- **Web Search Engine**: Searches the internet for conspiracy theories and related evidence
- **Popularity Tracking**: Ranks theories by search volume, social media mentions, and trending data
- **Multi-Source Analysis**: Pulls from news outlets, social media, forums, academic papers, and government documents
- **AI-Powered Analysis**: Uses Claude AI to evaluate theories comprehensively

### Analysis Methods (User Selectable)

#### Method 1: Multi-Tier Confidence System
- 5 categories: Verified, Strongly Supported, Plausible, Unverified, Contradicted
- Percentage confidence scores (0-100%)
- Knowability ratings

#### Method 2: Evidence-Based Scoring
- Scores based on evidence quality
- Shows number of credible sources, types of evidence
- Presents evidence without forcing conclusions

#### Method 3: Comparative Analysis
- Side-by-side comparison of official narrative vs. conspiracy theory
- Highlights supporting and contradicting evidence
- Identifies what evidence would settle questions

### Advanced Features

- **Destroyed Evidence Tracker**: Flags when evidence has been destroyed, sealed, or is missing
- **Investigation Quality Assessment**: Evaluates whether official investigations showed signs of obstruction
- **Timeline Tracking**: Monitors how long ago events occurred and declassification status
- **Historical Pattern Matching**: Compares to previously proven conspiracies (MK-ULTRA, COINTELPRO, etc.)
- **Motivational Analysis**: Examines WHY theories exist (distraction, cover-up, psychological reasons)
- **Counter-Narrative Analysis**: Examines who benefits from different narratives
- **Source Track Record System**: Tracks historical accuracy of sources
- **User-Adjustable Bias Controls**: Allows users to adjust source weighting preferences
- **Community Contribution**: Users can submit evidence and challenge conclusions

## Technology Stack

- **Frontend**: React with modern hooks and context API
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: Anthropic Claude API
- **Search**: Multiple search API integrations

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- API keys for Anthropic, Google Search, and/or Bing Search

### Setup

1. Clone the repository:
```bash
git clone https://github.com/El-apuesto/3rd-eye-view.git
cd 3rd-eye-view
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

4. Set up the database:
```bash
psql -U your_db_user -d postgres -f database/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Analyzing a Theory

1. Navigate to the search page
2. Enter a conspiracy theory or topic
3. Select your preferred analysis method(s)
4. Adjust source weighting if desired
5. Review the comprehensive analysis with evidence

### Adjusting Bias Controls

1. Go to Settings
2. Adjust sliders for different source types:
   - Government sources
   - Mainstream media
   - Alternative media
   - Academic sources
   - Whistleblowers
3. Save preferences

### Contributing Evidence

1. Navigate to any theory page
2. Click "Submit Evidence"
3. Provide source links and description
4. Community moderators will review submissions

## Project Structure

```
3rd-eye-view/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.js
│   └── package.json
├── server/                # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── index.js          # Entry point
├── database/             # Database schemas and migrations
├── docs/                 # Documentation
└── package.json
```

## Ethical Considerations

This tool is designed with transparency and education in mind:

- **Open Source**: All code and methodology are publicly auditable
- **Educational Focus**: Teaches critical thinking, not just providing answers
- **Honest Limitations**: Clearly states what cannot be known
- **No Single Truth Score**: Avoids oversimplification
- **Community-Driven**: Allows user contributions and challenges

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

This tool analyzes available evidence; it cannot determine absolute truth. Users are encouraged to do their own research and think critically. This platform is for educational and research purposes.

## Acknowledgments

Based on research into historical proven conspiracies including MK-ULTRA, COINTELPRO, Operation Paperclip, and others that demonstrate the importance of evidence-based skepticism.
