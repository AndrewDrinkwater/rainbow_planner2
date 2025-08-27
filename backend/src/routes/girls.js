import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months };
}

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM girls ORDER BY id');
    const rows = result.rows.map(row => {
      const age = calculateAge(row.date_of_birth);
      return { ...row, age: `${age.years} years ${age.months} months` };
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch girls' });
  }
});

router.post('/', async (req, res) => {
  const { first_name, last_name, date_of_birth, state } = req.body;
  if (!first_name || !last_name || !date_of_birth || !state) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const insert = `INSERT INTO girls (first_name, last_name, date_of_birth, state)
                    VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [first_name, last_name, date_of_birth, state];
    const result = await query(insert, values);
    const girl = result.rows[0];
    const age = calculateAge(girl.date_of_birth);
    res.status(201).json({ ...girl, age: `${age.years} years ${age.months} months` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create girl' });
  }
});

export default router;
