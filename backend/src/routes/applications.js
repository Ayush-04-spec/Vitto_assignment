const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper function to validate UUID format
const isValidUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to validate Indian mobile number
const isValidMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// ENDPOINT 1: POST /api/applications
// Create a new loan application
router.post('/applications', async (req, res) => {
  try {
    const { name, mobile, amount, purpose, language } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Mobile is required and must be a valid Indian mobile number (10 digits starting with 6-9)' });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount is required and must be a positive number' });
    }

    if (!purpose || typeof purpose !== 'string' || purpose.trim() === '') {
      return res.status(400).json({ error: 'Purpose is required and must be a non-empty string' });
    }

    const validLanguages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
    if (!language || !validLanguages.includes(language)) {
      return res.status(400).json({ error: `Language is required and must be one of: ${validLanguages.join(', ')}` });
    }

    // Insert into database using parameterized query
    const result = await pool.query(
      `INSERT INTO applications (name, mobile, amount, purpose, language) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name.trim(), mobile, amount, purpose.trim(), language]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ENDPOINT 2: GET /api/applications
// Get all applications with optional status filter
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM applications';
    let params = [];

    // If status filter is provided
    if (status) {
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ENDPOINT 3: PATCH /api/applications/:id/status
// Update application status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid application ID format' });
    }

    // Validate status
    const validStatuses = ['approved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    // Update the application
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Check if application was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ENDPOINT 4: GET /api/summary
// Get summary statistics
router.get('/summary', async (req, res) => {
  try {
    // Single query to get counts and sum grouped by status
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(amount) as total_amount,
        status,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
      FROM applications
      GROUP BY ROLLUP(status)
      ORDER BY status NULLS FIRST
    `);

    // The ROLLUP will give us a row with NULL status containing totals
    const totalRow = result.rows.find(row => row.status === null);
    
    // If no applications exist
    if (!totalRow) {
      return res.status(200).json({
        total: 0,
        totalAmount: 0,
        byStatus: {
          pending: 0,
          approved: 0,
          rejected: 0
        }
      });
    }

    // Build response object
    const summary = {
      total: parseInt(totalRow.total),
      totalAmount: parseFloat(totalRow.total_amount) || 0,
      byStatus: {
        pending: parseInt(totalRow.pending_count) || 0,
        approved: parseInt(totalRow.approved_count) || 0,
        rejected: parseInt(totalRow.rejected_count) || 0
      }
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
