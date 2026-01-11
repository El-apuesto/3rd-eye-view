-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  account_type VARCHAR(50) DEFAULT 'standard',
  verification_status VARCHAR(50) DEFAULT 'unverified',
  rate_limit_tier VARCHAR(50) DEFAULT 'free',
  api_key_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- analysis_queries table
CREATE TABLE analysis_queries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  query_text TEXT NOT NULL,
  query_type VARCHAR(50) DEFAULT 'full_analysis',
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  anonymized_at TIMESTAMP
);

-- analysis_results table
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  query_id INTEGER REFERENCES analysis_queries(id),
  overall_confidence_score DECIMAL(5,2),
  evidence_quality_score DECIMAL(5,2),
  source_credibility_score DECIMAL(5,2),
  logical_consistency_score DECIMAL(5,2),
  summary TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  red_flags JSONB DEFAULT '[]'::jsonb,
  investigation_needed JSONB DEFAULT '[]'::jsonb,
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sources table
CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  source_type VARCHAR(50),
  credibility_score DECIMAL(5,2) DEFAULT 50.00,
  claim_count INTEGER DEFAULT 0,
  verified_claim_count INTEGER DEFAULT 0,
  retraction_count INTEGER DEFAULT 0,
  correction_count INTEGER DEFAULT 0,
  bias_rating VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- evidence_items table
CREATE TABLE evidence_items (
  id SERIAL PRIMARY KEY,
  result_id INTEGER REFERENCES analysis_results(id),
  title VARCHAR(500),
  url TEXT NOT NULL,
  snippet TEXT,
  publish_date DATE,
  source_id INTEGER REFERENCES sources(id),
  quality_score DECIMAL(5,2),
  is_primary_source BOOLEAN DEFAULT false,
  provenance_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- historical_events table
CREATE TABLE historical_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE,
  description TEXT,
  start_year INTEGER,
  end_year INTEGER,
  revealed_year INTEGER,
  government_admission BOOLEAN DEFAULT false,
  evidence_destruction BOOLEAN DEFAULT false,
  pattern_characteristics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- pattern_matches table
CREATE TABLE pattern_matches (
  id SERIAL PRIMARY KEY,
  result_id INTEGER REFERENCES analysis_results(id),
  event_id INTEGER REFERENCES historical_events(id),
  similarity_score DECIMAL(5,2),
  matching_characteristics JSONB DEFAULT '[]'::jsonb,
  differences JSONB DEFAULT '[]'::jsonb,
  temporal_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- watermarks table
CREATE TABLE watermarks (
  id SERIAL PRIMARY KEY,
  watermark_code VARCHAR(100) UNIQUE NOT NULL,
  result_id INTEGER REFERENCES analysis_results(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- usage_logs table
CREATE TABLE usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  response_time_ms INTEGER,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- abuse_reports table
CREATE TABLE abuse_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  query_id INTEGER REFERENCES analysis_queries(id),
  abuse_type VARCHAR(100),
  severity VARCHAR(50),
  description TEXT,
  automated_detection BOOLEAN DEFAULT true,
  reviewed BOOLEAN DEFAULT false,
  reviewer_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- public_audit_logs table
CREATE TABLE public_audit_logs (
  id SERIAL PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_queries INTEGER DEFAULT 0,
  avg_confidence_score DECIMAL(5,2),
  flagged_queries_count INTEGER DEFAULT 0,
  top_patterns JSONB DEFAULT '[]'::jsonb,
  geographic_region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_queries_user_id ON analysis_queries(user_id);
CREATE INDEX idx_queries_created_at ON analysis_queries(created_at);
CREATE INDEX idx_results_query_id ON analysis_results(query_id);
CREATE INDEX idx_evidence_result_id ON evidence_items(result_id);
CREATE INDEX idx_evidence_source_id ON evidence_items(source_id);
CREATE INDEX idx_pattern_result_id ON pattern_matches(result_id);
CREATE INDEX idx_pattern_event_id ON pattern_matches(event_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_abuse_user_id ON abuse_reports(user_id);