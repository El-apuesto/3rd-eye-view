const validateTheoryInput = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (title.length > 500) {
    return res.status(400).json({ error: 'Title must be 500 characters or less' });
  }
  
  if (description && description.length > 5000) {
    return res.status(400).json({ error: 'Description must be 5000 characters or less' });
  }
  
  next();
};

const validateEvidenceSubmission = (req, res, next) => {
  const { theory_id, source_url, evidence_description } = req.body;
  
  if (!theory_id || !Number.isInteger(theory_id)) {
    return res.status(400).json({ error: 'Valid theory ID is required' });
  }
  
  if (!source_url || !isValidUrl(source_url)) {
    return res.status(400).json({ error: 'Valid source URL is required' });
  }
  
  if (!evidence_description || evidence_description.trim().length === 0) {
    return res.status(400).json({ error: 'Evidence description is required' });
  }
  
  if (evidence_description.length > 2000) {
    return res.status(400).json({ error: 'Evidence description must be 2000 characters or less' });
  }
  
  next();
};

const validateSearchQuery = (req, res, next) => {
  const { query } = req.query;
  
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  if (query.length > 200) {
    return res.status(400).json({ error: 'Search query must be 200 characters or less' });
  }
  
  next();
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

module.exports = {
  validateTheoryInput,
  validateEvidenceSubmission,
  validateSearchQuery
};
