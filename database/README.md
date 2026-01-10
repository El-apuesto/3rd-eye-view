# Database Setup

## PostgreSQL Database for 3rd Eye View

### Prerequisites

- PostgreSQL 14 or higher installed
- A PostgreSQL user with database creation privileges

### Setup Instructions

#### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE third_eye_view;

# Create user (if needed)
CREATE USER your_db_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE third_eye_view TO your_db_user;

# Exit
\q
```

#### 2. Run Schema

```bash
psql -U your_db_user -d third_eye_view -f schema.sql
```

### Database Structure

#### Tables

**users**
- Stores user account information
- Includes roles for access control (user, moderator, admin)

**theories**
- Core table storing conspiracy theories
- Tracks popularity, timeline, and verification status
- Includes flags for evidence destruction and government relation

**source_track_records**
- Tracks credibility and accuracy of information sources
- Maintains historical accuracy counts
- Categorizes by source type and political lean

**theory_sources**
- Junction table connecting theories to their sources
- Stores evidence quality and type
- Tracks which narrative each source supports

**analysis_history**
- Stores all AI analysis results
- Maintains different analysis methods
- Includes full JSON data for comprehensive records

**evidence_submissions**
- Community-contributed evidence
- Moderation workflow (pending/approved/rejected)

**user_preferences**
- Individual user settings
- Adjustable source weighting
- Analysis method preferences

**saved_theories**
- User bookmarks for theories they're following

### Seed Data

The schema includes seed data for:
- 8 historically proven conspiracy theories (MK-ULTRA, COINTELPRO, etc.)
- 10 common source organizations with credibility scores

### Indexes

Optimized indexes for:
- Theory searches by category, status, and popularity
- Source lookups
- Analysis history queries
- Evidence submission filtering

### Maintenance

#### Backup Database

```bash
pg_dump -U your_db_user third_eye_view > backup.sql
```

#### Restore Database

```bash
psql -U your_db_user third_eye_view < backup.sql
```

#### View Table Statistics

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
