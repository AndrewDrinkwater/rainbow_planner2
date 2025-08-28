// backend/src/routes/girls.js
import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { state } = req.query;
    const base = 'SELECT id, first_name, last_name, date_of_birth, added_to_go, state FROM girls';
    const sql = state ? `${base} WHERE state = $1 ORDER BY id` : `${base} ORDER BY id`;
    const params = state ? [state] : [];
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, first_name, last_name, date_of_birth, added_to_go, state FROM girls WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { first_name, last_name, date_of_birth, added_to_go, state } = req.body;
    const { rows } = await query(
      `INSERT INTO girls (first_name, last_name, date_of_birth, added_to_go, state)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, date_of_birth, added_to_go, state`,
      [first_name, last_name, date_of_birth, added_to_go, state]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const fields = ['first_name', 'last_name', 'date_of_birth', 'added_to_go', 'state'];
    const updates = [];
    const values = [];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        values.push(req.body[f]);
        updates.push(`${f} = $${values.length}`);
      }
    });
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);

    const { rows } = await query(
      `UPDATE girls SET ${updates.join(', ')} WHERE id = $${values.length}
       RETURNING id, first_name, last_name, date_of_birth, added_to_go, state`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM girls WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
