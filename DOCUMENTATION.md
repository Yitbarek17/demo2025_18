# Ethiopian Workplace Repository Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technical Stack](#technical-stack)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [User Interface](#user-interface)
8. [Authentication](#authentication)
9. [Internationalization](#internationalization)
10. [Theme System](#theme-system)
11. [Data Flow](#data-flow)
12. [Form Validation](#form-validation)
13. [Analytics & Reporting](#analytics--reporting)
14. [Deployment](#deployment)
15. [Development Guide](#development-guide)

## Overview

The Ethiopian Workplace Repository is a comprehensive web application designed for managing and analyzing workplace data across Ethiopia. It provides tools for tracking projects across multiple sectors, regions, and organizational structures with detailed analytics and reporting capabilities.

### Key Objectives
- Centralized project data management
- Real-time analytics and insights
- Multi-language support (English/Amharic)
- Responsive design for all devices
- Comprehensive reporting capabilities

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   (SQLite)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture
```
src/
├── components/          # React components
│   ├── common/          # Reusable components
│   │   ├── StatCard.tsx
│   │   ├── InputField.tsx
│   │   └── DuplicateWarning.tsx
│   ├── dashboard/       # Dashboard components
│   │   ├── DashboardStats.tsx
│   │   ├── SectorChart.tsx
│   │   ├── StatusChart.tsx
│   │   ├── RegionalChart.tsx
│   │   └── GenderDistribution.tsx
│   ├── projects/        # Project management components
│   │   ├── ProjectTable.tsx
│   │   ├── ProjectFilters.tsx
│   │   └── ProjectModal.tsx
│   ├── Dashboard.tsx    # Main dashboard
│   ├── ProjectList.tsx  # Project listing & management
│   ├── ProjectForm.tsx  # Add/Edit project form
│   ├── Analytics.tsx    # Analytics & charts
│   ├── Homepage.tsx     # Landing page
│   └── LoginPage.tsx    # Authentication
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   ├── ThemeContext.tsx # Dark/Light theme
│   └── LanguageContext.tsx # Internationalization
├── services/            # API services
│   └── api.ts          # HTTP client
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
└── App.tsx             # Main application component
```

### Backend Architecture
```
server/
├── controllers/         # Route controllers
│   ├── projectController.js
│   └── metadataController.js
├── routes/             # Express routes
│   ├── projects.js
│   └── metadata.js
├── index.js            # Express server
├── database.js         # Database operations
└── projects.db        # SQLite database file
```

## Features

### Core Features
1. **Project Management**
   - Create, read, update, delete (CRUD) operations
   - Comprehensive project information tracking
   - Duplicate detection and prevention
   - File organization and data validation

2. **Analytics Dashboard**
   - Real-time statistics
   - Interactive charts and graphs
   - Sector-wise analysis
   - Regional distribution
   - Gender workforce analytics
   - Performance metrics

3. **Multi-language Support**
   - English and Amharic languages
   - Dynamic language switching
   - Persistent language preferences
   - Fallback mechanism for missing translations

4. **Theme System**
   - Dark and light themes
   - System preference detection
   - Smooth transitions

5. **Responsive Design**
   - Mobile-first approach
   - Tablet and desktop optimization
   - Touch-friendly interfaces

## Technical Stack

### Frontend
- **React 18.3.1**: UI library with hooks and functional components
- **TypeScript**: Type safety and better development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for analytics
- **Lucide React**: Icon library
- **Axios**: HTTP client for API calls
- **Date-fns**: Date manipulation library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite3**: Lightweight database
- **CORS**: Cross-origin resource sharing

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Concurrently**: Run multiple commands
- **Autoprefixer**: CSS vendor prefixes

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  companyName TEXT NOT NULL,
  sector TEXT NOT NULL,
  subSector TEXT NOT NULL,
  region TEXT NOT NULL,
  zone TEXT NOT NULL,
  woreda TEXT NOT NULL,
  approvalDate TEXT NOT NULL,
  owner TEXT NOT NULL,
  advisorCompany TEXT,
  evaluator TEXT,
  grantedBy TEXT,
  contactPerson TEXT NOT NULL,
  ownerPhone TEXT NOT NULL,
  companyEmail TEXT NOT NULL,
  companyWebsite TEXT,
  projectStatus TEXT NOT NULL,
  employeesMale INTEGER DEFAULT 0,
  employeesFemale INTEGER DEFAULT 0,
  employeesTotal INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

### Metadata Structure
```javascript
{
  regions: [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz",
    "Dire Dawa", "Gambela", "Harari", "Oromia", "Sidama",
    "SNNP", "Somali", "Tigray", "Southwest", "Central Ethiopia"
  ],
  sectors: ["Health", "Industry", "Agriculture"],
  subSectors: [
    "Agroprocessing", "Food and Beverage", "Construction and Engineering",
    "Chemical and Detergents", "Textile and Garment", "Multi-Sectorial",
    "Minerals", "Other"
  ],
  projectStatuses: ["Planning", "In Progress", "Completed", "On Hold", "Cancelled"]
}
```

## API Endpoints

### Project Endpoints
- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update existing project
- `DELETE /api/projects/:id` - Delete project

### Metadata Endpoints
- `GET /api/metadata` - Retrieve system metadata

### Request/Response Examples

#### Create Project
```javascript
POST /api/projects
{
  "companyName": "Example Company",
  "sector": "Health",
  "subSector": "Multi-Sectorial",
  "region": "Addis Ababa",
  "zone": "Addis Ababa Zone",
  "woreda": "Kirkos",
  "approvalDate": "2024-01-15",
  "owner": "John Doe",
  "projectStatus": "In Progress",
  "employeesMale": 25,
  "employeesFemale": 30,
  "employeesTotal": 55,
  // ... other fields
}
```

## User Interface

### Navigation Structure
```
Homepage
├── Dashboard
│   ├── Statistics Cards
│   ├── Sector Charts
│   ├── Status Distribution
│   └── Regional Analysis
├── Projects
│   ├── Project List
│   ├── Search & Filters
│   ├── Add/Edit Forms
│   └── Project Details
└── Analytics
    ├── Overview
    ├── Sector Analysis
    ├── Regional Analysis
    ├── Workforce Analytics
    └── Performance Metrics
```

### Component Hierarchy
```
App
├── AuthProvider
│   ├── ThemeProvider
│   │   ├── LanguageProvider
│   │   │   ├── Homepage
│   │   │   ├── LoginPage
│   │   │   ├── Dashboard
│   │   │   │   ├── DashboardStats
│   │   │   │   ├── SectorChart
│   │   │   │   ├── StatusChart
│   │   │   │   ├── RegionalChart
│   │   │   │   └── GenderDistribution
│   │   │   ├── ProjectList
│   │   │   │   ├── ProjectFilters
│   │   │   │   ├── ProjectTable
│   │   │   │   └── ProjectModal
│   │   │   ├── ProjectForm
│   │   │   │   ├── InputField
│   │   │   │   └── DuplicateWarning
│   │   │   └── Analytics
```

### Component Decomposition

#### Common Components
- **StatCard**: Reusable statistics display component
- **InputField**: Form input component with validation
- **DuplicateWarning**: Project duplicate detection component

#### Dashboard Components
- **DashboardStats**: Statistics overview cards
- **SectorChart**: Pie chart for sector distribution
- **StatusChart**: Bar chart for project status
- **RegionalChart**: Regional distribution chart
- **GenderDistribution**: Gender statistics display

#### Project Components
- **ProjectTable**: Data table with sorting and actions
- **ProjectFilters**: Search and filter controls
- **ProjectModal**: Project details modal

## Authentication

### Authentication Flow
1. User enters credentials on login page
2. System validates against demo credentials
3. User data stored in localStorage
4. Authentication state managed via React Context
5. Protected routes check authentication status

### Demo Credentials
- **Username**: demo
- **Password**: demo123

### Security Features
- Client-side authentication state management
- Persistent login sessions
- Automatic logout functionality
- Protected route access

## Internationalization

### Language Support
- **English (en)**: Default language
- **Amharic (am)**: Ethiopian local language

### Implementation
```javascript
// Language context usage
const { t, language, setLanguage } = useLanguage();

// Translation example
t('nav.dashboard') // Returns "Dashboard" or "ዳሽቦርድ"
```

### Translation Structure
```javascript
interface TranslationMap {
  [key: string]: string;
}

const translations: { en: TranslationMap; am: TranslationMap } = {
  en: {
    'nav.dashboard': 'Dashboard',
    'common.save': 'Save',
    'app.title': 'Ethiopian Project Management System',
    // ... more translations
  },
  am: {
    'nav.dashboard': 'ዳሽቦርድ',
    'common.save': 'አስቀምጥ',
    'app.title': 'የፕሮጀክት አስተዳደር ስርዓት',
    // ... more translations
  }
}
```

### Fallback Mechanism
- Missing Amharic translations automatically fall back to English
- Ensures no missing text in the interface
- Implemented via automatic key mapping

## Theme System

### Theme Implementation
- **Light Theme**: Default clean interface
- **Dark Theme**: Dark background with light text
- **System Detection**: Automatically detects user preference
- **Persistent Storage**: Saves theme choice in localStorage

### Theme Context Usage
```javascript
const { isDark, toggleTheme } = useTheme();

// Conditional styling
className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
```

## Data Flow

### Project Creation Flow
1. User clicks "Add Project" button
2. ProjectForm component opens in modal
3. User fills form with validation
4. Duplicate detection runs automatically
5. Form submission calls API
6. Database updated via SQLite operations
7. UI refreshes with new project data

### Analytics Data Flow
1. Projects data fetched from API
2. Data processed and aggregated
3. Charts and statistics calculated
4. Interactive visualizations rendered
5. Real-time updates on data changes

## Form Validation

### Validation Rules
- **Required Fields**: Company name, sector, region, etc.
- **Email Validation**: Proper email format checking
- **Phone Validation**: Phone number format
- **Date Validation**: Valid date formats
- **Duplicate Detection**: Prevents duplicate projects

### Custom Sub-Sector Handling
```javascript
// When "Other" is selected
if (formData.subSector === 'Other') {
  // Show additional input field
  // Validate custom input is provided
  // Save custom value instead of "Other"
}
```

### Error Handling
- Field-level validation messages
- Form-level error display
- Real-time validation feedback
- Accessibility-compliant error states

## Analytics & Reporting

### Dashboard Analytics
- **Total Projects**: Count of all projects
- **Total Employees**: Sum of all employees
- **Completion Rate**: Percentage of completed projects
- **Gender Distribution**: Male/female employee ratios

### Advanced Analytics
1. **Sector Analysis**
   - Projects by sector
   - Employee distribution
   - Performance metrics

2. **Regional Analysis**
   - Geographic distribution
   - Regional performance
   - Market penetration

3. **Workforce Analytics**
   - Gender balance analysis
   - Team size distribution
   - Workforce trends

4. **Performance Metrics**
   - Project status tracking
   - Timeline analysis
   - Success rates

### Chart Types
- **Pie Charts**: Sector distribution
- **Bar Charts**: Regional comparison
- **Line Charts**: Trend analysis
- **Area Charts**: Cumulative data

## Deployment

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
# .env file
VITE_API_URL=https://your-domain.com/api
```

### Server Configuration
- Express.js serves both API and static files
- SQLite database for data persistence
- CORS enabled for cross-origin requests

## Development Guide

### Code Organization

#### Frontend Structure
- **Components**: Organized by feature and reusability
- **Common Components**: Shared across multiple features
- **Feature Components**: Specific to dashboard, projects, etc.
- **Contexts**: Global state management
- **Services**: API communication
- **Types**: TypeScript definitions

#### Backend Structure
- **Routes**: Express route definitions
- **Controllers**: Business logic handlers
- **Database**: SQLite operations and schema

### Adding New Features

#### 1. Adding New Form Fields
```javascript
// 1. Update TypeScript interface
interface Project {
  // ... existing fields
  newField: string;
}

// 2. Update database schema
ALTER TABLE projects ADD COLUMN newField TEXT;

// 3. Update form component
<InputField 
  label="New Field" 
  name="newField" 
  value={formData.newField}
  onChange={handleChange}
/>
```

#### 2. Adding New Analytics
```javascript
// 1. Process data
const newAnalytics = projects.map(project => ({
  // ... data transformation
}));

// 2. Create visualization component
const NewChart: React.FC = ({ data }) => (
  <ResponsiveContainer>
    <BarChart data={data}>
      {/* Chart configuration */}
    </BarChart>
  </ResponsiveContainer>
);
```

#### 3. Adding Translations
```javascript
// Add to both language objects
translations.en['new.key'] = 'English Text';
translations.am['new.key'] = 'Amharic Text';

// Use in components
{t('new.key')}
```

#### 4. Creating New Components
```javascript
// Follow the established pattern
interface ComponentProps {
  // Define props
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  return (
    <div className={`transition-colors ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      {/* Component content */}
    </div>
  );
};
```

### Code Style Guidelines
- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Write descriptive component names
- Use React hooks appropriately
- Keep components under 300 lines
- Extract reusable logic into custom hooks

### Component Guidelines
- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Common components should be in the `common/` folder
- **Props Interface**: Always define TypeScript interfaces for props
- **Theme Support**: Use theme context for consistent styling
- **Internationalization**: Use translation context for all text

### Testing Considerations
- Test form validation
- Verify API endpoints
- Check responsive design
- Validate translations
- Test theme switching
- Verify data persistence

### Performance Optimization
- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize database queries
- Use lazy loading where appropriate
- Minimize bundle size
- Extract common components to reduce duplication

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check SQLite file permissions
   - Verify database initialization
   - Ensure proper file paths

2. **API Endpoint Issues**
   - Verify server is running
   - Check CORS configuration
   - Validate request/response formats

3. **Form Validation Problems**
   - Check required field validation
   - Verify error message display
   - Test duplicate detection logic

4. **Theme/Language Issues**
   - Clear localStorage if needed
   - Check context provider hierarchy
   - Verify translation keys exist

5. **Component Import Errors**
   - Check file paths and exports
   - Verify component names match
   - Ensure proper TypeScript interfaces

### Debug Mode
```javascript
// Enable debug logging
console.log('Debug info:', data);

// Check authentication state
console.log('User:', user);

// Verify API responses
console.log('API Response:', response.data);
```

## Future Enhancements

### Potential Features
1. **Advanced Reporting**
   - PDF export functionality
   - Custom report builder
   - Scheduled reports

2. **User Management**
   - Multiple user roles
   - Permission-based access
   - User activity logging

3. **Data Import/Export**
   - CSV/Excel import
   - Bulk data operations
   - Data backup/restore

4. **Advanced Analytics**
   - Predictive analytics
   - Trend forecasting
   - Machine learning insights

5. **Integration Capabilities**
   - External API integrations
   - Third-party service connections
   - Webhook support

6. **Enhanced UI/UX**
   - Drag and drop functionality
   - Advanced filtering options
   - Real-time notifications

---

This documentation provides a comprehensive overview of the Ethiopian Project Management System. For specific implementation details, refer to the source code and inline comments.