import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import Project from './models/Project.js';
import User from './models/User.js';
import { sampleProjects } from './data/sampleData.js';
import projectRoutes from './routes/projects.js';
import metadataRoutes from './routes/metadata.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/users', userRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Initialize database and start server
const startServer = async () => {
  try {
    // Try to connect to MongoDB
    const dbConnection = await connectDB();
    
    // Only seed database if MongoDB connection is successful
    if (dbConnection) {
      try {
        // Create default admin user if no users exist
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('Creating default admin user...');
          const adminUser = new User({
            username: 'admin',
            email: 'admin@projectmanagement.com',
            password: 'admin123',
            role: 'admin'
          });
          await adminUser.save();
          console.log('Default admin user created (username: admin, password: admin123)');
          
          // Create demo user
          const demoUser = new User({
            username: 'demo',
            email: 'demo@projectmanagement.com',
            password: 'demo123',
            role: 'user'
          });
          await demoUser.save();
          console.log('Demo user created (username: demo, password: demo123)');
        }
        
        // Seed projects if none exist
        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
          console.log('Seeding database with sample projects...');
          // Add createdBy field to sample projects
          const projectsWithCreator = sampleProjects.map(project => ({
            ...project,
            createdBy: 'admin',
            clinic: 'Available' // Default clinic value
          }));
          await Project.insertMany(projectsWithCreator);
          console.log(`Successfully inserted ${sampleProjects.length} sample projects`);
        } else {
          console.log(`Database already contains ${projectCount} projects`);
        }
      } catch (seedError) {
        console.error('Error seeding database:', seedError);
      }
    } else {
      console.log('Skipping database seeding - no MongoDB connection');
    }
    
    // Start the server regardless of database connection status
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!dbConnection) {
        console.log('Note: Server started without MongoDB connection');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();