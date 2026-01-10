# Database Setup Instructions

## Prerequisites
- PostgreSQL 14 or higher installed
- Database user with create database privileges

## Setup Steps

### 1. Create Database
```bash
psql -U postgres
CREATE DATABASE conspiracy_analyzer;
\q
```

### 2. Run Schema
```bash
psql -U your_username -d conspiracy_analyzer -f schema.sql
```

### 3. Verify Installation
```bash
psql -U your_username -d conspiracy_analyzer
\dt
```

You should see the following tables:
- users
- theories
- analyses
- evidence
- missing_evidence

## Database Schema Overview

### Tables

#### `theories`
Stores conspiracy theories submitted by users or discovered through searches.

**Key Fields:**
- `id`: Unique identifier
- `title`: Theory title
- `description`: Detailed description
- `category`: Category classification
- `tags`: JSON array of tags
- `status`: pending, active, or archived
- `view_count`: Popularity metric

#### `analyses`
Stores AI analysis results for theories.

**Key Fields:**
- `theory_id`: References theories table
- `methods`: JSON array of analysis methods used
- `results`: Complete analysis results in JSON
- `user_weights`: User's source weighting preferences
- `confidence_score`: Overall confidence (0-100)

#### `evidence`
Stores evidence submitted by users or collected from searches.

**Key Fields:**
- `theory_id`: References theories table
- `source_url`: URL to evidence source
- `description`: Evidence description
- `evidence_type`: Type classification
- `quality_score`: Quality rating (0-100)
- `source_credibility`: Source credibility (0-100)
- `verification_status`: verified, partially-verified, unverified
- `upvotes/downvotes`: Community voting

#### `missing_evidence`
Tracks destroyed, missing, or classified evidence.

**Key Fields:**
- `theory_id`: References theories table
- `description`: What evidence is missing
- `reason`: Why it's missing (destroyed, classified, etc.)

## Maintenance

### Backup Database
```bash
pg_dump -U your_username conspiracy_analyzer > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U your_username -d conspiracy_analyzer < backup_file.sql
```

### Clear All Data (Keep Schema)
```bash
psql -U your_username -d conspiracy_analyzer
TRUNCATE theories, analyses, evidence, missing_evidence, users CASCADE;
```

## Performance Optimization

The schema includes indexes on:
- Theory categories and status
- View counts for popularity sorting
- Creation dates for time-based queries
- Foreign keys for join performance
- Evidence quality scores

## Security Notes

1. Never commit .env file with database credentials
2. Use strong passwords for database users
3. Limit database user privileges to only what's needed
4. Enable SSL for database connections in production
5. Regular backups are essential
