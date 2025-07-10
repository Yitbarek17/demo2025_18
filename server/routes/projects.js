import express from 'express';
import { 
  getAllProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectStats 
} from '../controllers/projectController.js';

const router = express.Router();

// Get all projects
router.get('/', getAllProjects);

// Get project statistics
router.get('/stats', getProjectStats);

// Create new project
router.post('/', createProject);

// Update existing project
router.put('/:id', updateProject);

// Delete project
router.delete('/:id', deleteProject);

export default router;