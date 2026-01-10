-- 3rd Eye View Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS evidence_submissions CASCADE;
DROP TABLE IF EXISTS analysis_history CASCADE;
DROP TABLE IF EXISTS theory_sources CASCADE;
DROP TABLE IF EXISTS source_track_records CASCADE;
DROP TABLE IF EXISTS theories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'user' -- 'user', 'moderator', 'admin'
);

-- Theories table
CREATE TABLE theories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'government', 'corporate', 'historical', 'current', etc.
    popularity_score INTEGER DEFAULT 0,
    search_volume INTEGER DEFAULT 0,
    social_mentions INTEGER DEFAULT 0,
    first_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    official_narrative TEXT,
    conspiracy_narrative TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'verified', 'debunked'
    timeline_date DATE, -- When the event allegedly occurred
    declassification_date DATE, -- Expected or actual declassification date
    evidence_destroyed BOOLEAN DEFAULT false,
    investigation_quality_score DECIMAL(3,2), -- 0.00 to 1.00
    government_related BOOLEAN DEFAULT false
);

-- Source track records
CREATE TABLE source_track_records (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(255) UNIQUE NOT NULL,
    source_url VARCHAR(500),
    source_type VARCHAR(50), -- 'government', 'mainstream_media', 'alternative_media', 'academic', 'whistleblower'
    verified_accurate_count INTEGER DEFAULT 0,
    verified_inaccurate_count INTEGER DEFAULT 0,
    unverified_count INTEGER DEFAULT 0,
    credibility_score DECIMAL(3,2), -- 0.00 to 1.00
    political_lean VARCHAR(50), -- 'left', 'center', 'right', 'mixed', 'unknown'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Theory sources (junction table)
CREATE TABLE theory_sources (
    id SERIAL PRIMARY KEY,
    theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
    source_id INTEGER REFERENCES source_track_records(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    title VARCHAR(500),
    content_snippet TEXT,
    supports_conspiracy BOOLEAN, -- true = supports conspiracy, false = supports official narrative, null = neutral
    evidence_type VARCHAR(50), -- 'document', 'testimony', 'forensic', 'statistical', 'circumstantial'
    evidence_quality DECIMAL(3,2), -- 0.00 to 1.00
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by INTEGER REFERENCES users(id),
    verified BOOLEAN DEFAULT false
);

-- Analysis history
CREATE TABLE analysis_history (
    id SERIAL PRIMARY KEY,
    theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
    analysis_method VARCHAR(50), -- 'confidence_system', 'evidence_based', 'comparative'
    confidence_category VARCHAR(50), -- 'verified', 'strongly_supported', 'plausible', 'unverified', 'contradicted'
    confidence_score DECIMAL(5,2), -- 0.00 to 100.00
    knowability_rating VARCHAR(50), -- 'provable', 'difficult', 'impossible'
    evidence_count INTEGER,
    credible_sources_count INTEGER,
    contradictions_found INTEGER,
    pattern_matches TEXT[], -- Array of matched historical conspiracy patterns
    motivational_analysis TEXT,
    counter_narrative_analysis TEXT,
    ai_reasoning TEXT,
    full_analysis_json JSONB, -- Complete analysis data
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyzed_by INTEGER REFERENCES users(id),
    ai_model VARCHAR(100),
    processing_time_ms INTEGER
);

-- Evidence submissions (community contributions)
CREATE TABLE evidence_submissions (
    id SERIAL PRIMARY KEY,
    theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
    submitted_by INTEGER REFERENCES users(id),
    source_url VARCHAR(1000) NOT NULL,
    source_title VARCHAR(500),
    evidence_description TEXT NOT NULL,
    supports_conspiracy BOOLEAN,
    evidence_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by INTEGER REFERENCES users(id),
    review_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    government_source_weight DECIMAL(3,2) DEFAULT 0.50,
    mainstream_media_weight DECIMAL(3,2) DEFAULT 0.50,
    alternative_media_weight DECIMAL(3,2) DEFAULT 0.50,
    academic_source_weight DECIMAL(3,2) DEFAULT 0.80,
    whistleblower_weight DECIMAL(3,2) DEFAULT 0.60,
    preferred_analysis_method VARCHAR(50) DEFAULT 'confidence_system',
    show_government_filter BOOLEAN DEFAULT true,
    track_reading_history BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved theories (user bookmarks)
CREATE TABLE saved_theories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
    notes TEXT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, theory_id)
);

-- Create indexes for better performance
CREATE INDEX idx_theories_category ON theories(category);
CREATE INDEX idx_theories_status ON theories(status);
CREATE INDEX idx_theories_government ON theories(government_related);
CREATE INDEX idx_theories_popularity ON theories(popularity_score DESC);
CREATE INDEX idx_theory_sources_theory ON theory_sources(theory_id);
CREATE INDEX idx_theory_sources_source ON theory_sources(source_id);
CREATE INDEX idx_analysis_theory ON analysis_history(theory_id);
CREATE INDEX idx_analysis_date ON analysis_history(analyzed_at DESC);
CREATE INDEX idx_evidence_submissions_status ON evidence_submissions(status);
CREATE INDEX idx_evidence_submissions_theory ON evidence_submissions(theory_id);

-- Insert some seed data for historical proven conspiracies
INSERT INTO theories (title, description, category, status, timeline_date, government_related, investigation_quality_score, evidence_destroyed) VALUES
('MK-ULTRA Mind Control Program', 'CIA conducted illegal mind control experiments using LSD and other substances on unwitting subjects', 'government', 'verified', '1953-04-13', true, 0.35, true),
('COINTELPRO', 'FBI conducted covert operations to surveil, infiltrate, and disrupt domestic political organizations', 'government', 'verified', '1956-08-28', true, 0.20, false),
('Tuskegee Syphilis Experiment', 'U.S. Public Health Service conducted unethical syphilis study on African American men without informed consent', 'government', 'verified', '1932-01-01', true, 0.15, false),
('Operation Northwoods', 'Department of Defense proposed false flag terrorist attacks on U.S. citizens to justify war with Cuba', 'government', 'verified', '1962-03-13', true, 0.90, false),
('Watergate Scandal', 'Nixon administration conducted illegal break-ins and cover-up operations', 'government', 'verified', '1972-06-17', true, 0.85, true),
('Iran-Contra Affair', 'Reagan administration secretly sold arms to Iran and funded Nicaraguan Contras', 'government', 'verified', '1985-08-20', true, 0.60, true),
('NSA Mass Surveillance', 'National Security Agency conducted warrantless mass surveillance on American citizens', 'government', 'verified', '2001-10-04', true, 0.70, false),
('Operation Paperclip', 'U.S. government secretly recruited Nazi scientists after World War II', 'government', 'verified', '1945-08-01', true, 0.45, false);

-- Insert source track records for common sources
INSERT INTO source_track_records (source_name, source_type, credibility_score, political_lean) VALUES
('National Archives', 'government', 0.95, 'center'),
('FBI Records', 'government', 0.75, 'center'),
('CIA Reading Room', 'government', 0.70, 'center'),
('The Guardian', 'mainstream_media', 0.80, 'center'),
('Associated Press', 'mainstream_media', 0.90, 'center'),
('Reuters', 'mainstream_media', 0.88, 'center'),
('The Intercept', 'alternative_media', 0.75, 'left'),
('ProPublica', 'alternative_media', 0.85, 'center'),
('National Security Archive', 'academic', 0.92, 'center'),
('WikiLeaks', 'whistleblower', 0.65, 'mixed');

COMMIT;
