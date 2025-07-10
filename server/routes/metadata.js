import express from 'express';

const router = express.Router();

// Updated metadata with new structure
const metadata = {
  regions: [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNP', 'Somali', 'Tigray', 'Southwest', 'Central Ethiopia'
  ],
  sectors: [
    'Health', 'Industry', 'Agriculture', 'Agro-processing', 
    'Food & Beverage', 'Construction & Engineering', 
    'Chemicals & Detergents', 'Textile & Garments', 
    'Multi-sectoral', 'Minerals'
  ],
  projectStatuses: ['In Progress', 'Functional', 'Terminated'],
  clinicOptions: ['Available', 'Unavailable']
};

// Get metadata
router.get('/', (req, res) => {
  res.json(metadata);
});

export default router;