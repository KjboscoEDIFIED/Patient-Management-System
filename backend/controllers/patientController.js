const pool = require('../config/db');

// GET /api/patients?search=&page=&limit=
exports.getAllPatients = async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let where = '';
    let params = [];
    if (search) {
      where = 'WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?';
      params = [search, search, search, search];
    }

    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, date_of_birth, gender, phone, email, blood_group, created_at
       FROM patients ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM patients ${where}`,
      params
    );

    res.json({
      patients: rows,
      total: countRows[0].total,
      page,
      totalPages: Math.ceil(countRows[0].total / limit)
    });
  } catch (err) {
    console.error('Get patients error:', err);
    res.status(500).json({ message: 'Something went wrong while fetching patients.' });
  }
};

// GET /api/patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const [records] = await pool.query(
      'SELECT * FROM patient_records WHERE patient_id = ? ORDER BY visit_date DESC',
      [req.params.id]
    );

    res.json({ patient: rows[0], records });
  } catch (err) {
    console.error('Get patient error:', err);
    res.status(500).json({ message: 'Something went wrong while fetching the patient.' });
  }
};

// POST /api/patients
exports.createPatient = async (req, res) => {
  try {
    const {
      first_name, last_name, date_of_birth, gender,
      phone, email, address, blood_group,
      emergency_contact_name, emergency_contact_phone
    } = req.body;

    if (!first_name || !last_name || !date_of_birth || !gender) {
      return res.status(400).json({ message: 'first_name, last_name, date_of_birth and gender are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO patients
       (first_name, last_name, date_of_birth, gender, phone, email, address, blood_group,
        emergency_contact_name, emergency_contact_phone, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, date_of_birth, gender, phone || null, email || null,
       address || null, blood_group || null, emergency_contact_name || null,
       emergency_contact_phone || null, req.user.id]
    );

    const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Patient registered successfully.', patient: rows[0] });
  } catch (err) {
    console.error('Create patient error:', err);
    res.status(500).json({ message: 'Something went wrong while registering the patient.' });
  }
};

// PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT id FROM patients WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const {
      first_name, last_name, date_of_birth, gender,
      phone, email, address, blood_group,
      emergency_contact_name, emergency_contact_phone
    } = req.body;

    await pool.query(
      `UPDATE patients SET
        first_name = ?, last_name = ?, date_of_birth = ?, gender = ?,
        phone = ?, email = ?, address = ?, blood_group = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?
       WHERE id = ?`,
      [first_name, last_name, date_of_birth, gender, phone || null, email || null,
       address || null, blood_group || null, emergency_contact_name || null,
       emergency_contact_phone || null, id]
    );

    const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
    res.json({ message: 'Patient updated successfully.', patient: rows[0] });
  } catch (err) {
    console.error('Update patient error:', err);
    res.status(500).json({ message: 'Something went wrong while updating the patient.' });
  }
};

// DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM patients WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    await pool.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    console.error('Delete patient error:', err);
    res.status(500).json({ message: 'Something went wrong while deleting the patient.' });
  }
};

// POST /api/patients/:id/records
exports.addRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { visit_date, diagnosis, treatment, notes } = req.body;

    if (!visit_date) {
      return res.status(400).json({ message: 'visit_date is required.' });
    }

    const [patient] = await pool.query('SELECT id FROM patients WHERE id = ?', [id]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const [result] = await pool.query(
      `INSERT INTO patient_records (patient_id, visit_date, diagnosis, treatment, notes, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, visit_date, diagnosis || null, treatment || null, notes || null, req.user.id]
    );

    const [rows] = await pool.query('SELECT * FROM patient_records WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Record added successfully.', record: rows[0] });
  } catch (err) {
    console.error('Add record error:', err);
    res.status(500).json({ message: 'Something went wrong while adding the record.' });
  }
};

// DELETE /api/patients/:patientId/records/:recordId
exports.deleteRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    await pool.query('DELETE FROM patient_records WHERE id = ?', [recordId]);
    res.json({ message: 'Record deleted successfully.' });
  } catch (err) {
    console.error('Delete record error:', err);
    res.status(500).json({ message: 'Something went wrong while deleting the record.' });
  }
};
