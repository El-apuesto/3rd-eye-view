const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateEvidenceSubmission } = require('../middleware/validation');

// Get evidence submissions
router.get('/', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const status = req.query.status || 'pending';
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const query = `
      SELECT es.*, t.title as theory_title, u.username as submitted_by_username
      FROM evidence_submissions es
      JOIN theories t ON es.theory_id = t.id
      JOIN users u ON es.submitted_by = u.id
      WHERE es.status = $1
      ORDER BY es.submitted_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await db.query(query, [status, limit, offset]);
    res.json({ submissions: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get evidence for specific theory
router.get('/theory/:theoryId', async (req, res, next) => {
  try {
    const theoryId = parseInt(req.params.theoryId);
    const includeAll = req.query.includeAll === 'true';

    let query = `
      SELECT es.*, u.username as submitted_by_username
      FROM evidence_submissions es
      JOIN users u ON es.submitted_by = u.id
      WHERE es.theory_id = $1
    `;

    if (!includeAll) {
      query += ` AND es.status = 'approved'`;
    }

    query += ` ORDER BY es.submitted_at DESC`;

    const result = await db.query(query, [theoryId]);
    res.json({ submissions: result.rows });
  } catch (error) {
    next(error);
  }
});

// Submit evidence
router.post('/', authenticateToken, validateEvidenceSubmission, async (req, res, next) => {
  try {
    const query = `
      INSERT INTO evidence_submissions (
        theory_id, submitted_by, source_url, source_title,
        evidence_description, supports_conspiracy, evidence_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      req.body.theory_id,
      req.user.id,
      req.body.source_url,
      req.body.source_title,
      req.body.evidence_description,
      req.body.supports_conspiracy,
      req.body.evidence_type
    ];

    const result = await db.query(query, values);
    res.status(201).json({ submission: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Review evidence (approve/reject)
router.put('/:id/review', authenticateToken, requireRole('moderator', 'admin'), async (req, res, next) => {
  try {
    const { status, review_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const query = `
      UPDATE evidence_submissions
      SET status = $1, reviewed_by = $2, review_notes = $3, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const result = await db.query(query, [
      status,
      req.user.id,
      review_notes,
      parseInt(req.params.id)
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete evidence submission
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    // Users can delete their own, moderators can delete any
    const query = `
      DELETE FROM evidence_submissions
      WHERE id = $1 AND (submitted_by = $2 OR $3 IN ('moderator', 'admin'))
      RETURNING *
    `;

    const result = await db.query(query, [
      parseInt(req.params.id),
      req.user.id,
      req.user.role
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found or unauthorized' });
    }

    res.json({ message: 'Evidence submission deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
