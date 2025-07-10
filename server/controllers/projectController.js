import Project from '../models/Project.js';
import Token from '../models/Token.js';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from '../utils/mail.utils.js';

export const getAllProjects = async (req, res) => {
  try {
    const { userId, userRole } = req.query;
    
    let query = {};
    
    // If user role, only show projects created by that user
    if (userRole === 'user' && userId) {
      query.createdBy = userId;
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(404).json({ error : "user not found"});
      return;
    }

    const resetToken = uuidv4();
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const token = new Token({
      email,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
    });
    await token.save();

    await sendMail(email, resetToken, token._id.toString());
    res.status(200).json({message: "forget password successfull"})
    return;
  } catch (e) {
    console.log(e)
    res.status(500).json({ error : "failed to send mail"})
  }
}

export const resetPassword = async (req, res) => {
  const { email, resetToken, password, tokenId } = req.body;
  const token = await Token.findById(tokenId);
  const user = await User.findOne({ email });

  if (!token) {
    res.status(404).json({error: "token not found"});
    return;
  }
  
  if (!user) {
    res.status(404).json({ error : "user not found"})
    return;
  }

  if (token.email != email) {
    res.status(400).json({error: "invalid token"})
    return;
  }

  if (token.expiresAt < new Date()) {
    res.status(400).json({ error : "token expired"});
    return;
  }

  const tokenMatches = await bcrypt.compare(resetToken, token.token);
  if (tokenMatches) {
    user.password = password;
    await user.save();
  }

  res.status(200).json({ message: "password reset sucessfull."});
};

export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { userId, userRole } = req.query;
    
    // Check if user has permission to edit this project
    if (userRole === 'user') {
      const existingProject = await Project.findById(req.params.id);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      if (existingProject.createdBy !== userId) {
        return res.status(403).json({ error: 'You can only edit projects you created' });
      }
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { userId, userRole } = req.query;
    
    // Only admins can delete projects
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can delete projects' });
    }
    
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { userId, userRole } = req.query;
    
    let matchQuery = {};
    
    // If user role, only show stats for projects created by that user
    if (userRole === 'user' && userId) {
      matchQuery.createdBy = userId;
    }
    
    const stats = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalEmployees: { $sum: '$employeesTotal' },
          totalMale: { $sum: '$employeesMale' },
          totalFemale: { $sum: '$employeesFemale' },
          avgEmployees: { $avg: '$employeesTotal' }
        }
      }
    ]);

    const sectorStats = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
          employees: { $sum: '$employeesTotal' }
        }
      }
    ]);

    const statusStats = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$projectStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {},
      sectors: sectorStats,
      statuses: statusStats
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
};