const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addRecord,
  deleteRecord
} = require('../controllers/patientController');
const { verifyToken } = require('../middleware/auth');

// All patient routes require a logged-in user
router.use(verifyToken);

router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

router.post('/:id/records', addRecord);
router.delete('/:patientId/records/:recordId', deleteRecord);

module.exports = router;
