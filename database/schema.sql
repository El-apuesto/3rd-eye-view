-- 3rd Eye View Database Schema
-- PostgreSQL Database

-- Drop existing tables if they exist
DROP TABLE IF EXISTS missing_evidence CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS analyses CASCADE;
DROP TABLE IF EXISTS theories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (simplified for now)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Theories table
CREATE TABLE theories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'uncategorized',
  tags JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, archived
  submitted_by VARCHAR(255) DEFAULT 'anonymous',
  initial_search_data JSONB DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
  methods JSONB NOT NULL, -- Array of methods used
  results JSONB NOT NULL, -- Full analysis results
  user_weights JSONB DEFAULT '{}',
  confidence_score DECIMAL(5,2), -- 0-100
  created_at TIMESTAMP DEFAULT NOW()
);

-- Evidence table
CREATE TABLE evidence (
  id SERIAL PRIMARY KEY,
  theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
  source_url TEXT,
  description TEXT NOT NULL,
  evidence_type VARCHAR(100) DEFAULT 'general',
  supports_claim BOOLEAN,
  submitted_by VARCHAR(255) DEFAULT 'anonymous',
  quality_score INTEGER DEFAULT 0, -- 0-100
  source_credibility INTEGER DEFAULT 0, -- 0-100
  verification_status VARCHAR(50) DEFAULT 'unverified',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Missing/Destroyed Evidence tracker
CREATE TABLE missing_evidence (
  id SERIAL PRIMARY KEY,
  theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  reason VARCHAR(255), -- destroyed, classified, lost, etc.
  reported_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_theories_category ON theories(category);
CREATE INDEX idx_theories_status ON theories(status);
CREATE INDEX idx_theories_view_count ON theories(view_count DESC);
CREATE INDEX idx_theories_created_at ON theories(created_at DESC);
CREATE INDEX idx_analyses_theory_id ON analyses(theory_id);
CREATE INDEX idx_evidence_theory_id ON evidence(theory_id);
CREATE INDEX idx_evidence_quality ON evidence(quality_score DESC);
CREATE INDEX idx_missing_evidence_theory_id ON missing_evidence(theory_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to theories
CREATE TRIGGER update_theories_updated_at 
  BEFORE UPDATE ON theories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to evidence
CREATE TRIGGER update_evidence_updated_at
  BEFORE UPDATE ON evidence
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO theories (title, description, category, tags, status) VALUES
('MK-ULTRA Mind Control', 'CIA conducted illegal mind control experiments on unwitting subjects using LSD and other drugs from 1953-1973.', 'government_experimentation', '["CIA", "mind control", "proven true"]', 'active'),
('COINTELPRO Surveillance', 'FBI conducted covert surveillance and disruption of civil rights groups and political organizations.', 'government_surveillance', '["FBI", "surveillance", "proven true"]', 'active'),
('NSA Mass Surveillance', 'NSA collects phone records, emails, and internet communications on mass scale without warrants.', 'surveillance', '["NSA", "Snowden", "privacy"]', 'active');

COMMIT;
