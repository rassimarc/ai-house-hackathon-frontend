# AI House Hackathon - Frontend

A modern React application for AI-powered household management, built for the AI House Hackathon. This application enables users to create and manage households, collaborate with team members, and receive intelligent assistance through an AI agent.

## Features

- **User Authentication**: Secure login and signup functionality
- **Household Management**: Create and join households with team members
- **AI Assistant Integration**: Real-time AI agent messaging via long-polling
- **Dashboard**: Comprehensive view of household activities and tasks
- **Team Collaboration**: Join existing households or create new ones
- **Responsive Design**: Modern UI with custom styling

## Tech Stack

- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **React Router DOM 7.9.5** - Client-side routing
- **Axios 1.13.2** - HTTP client for API requests
- **ESLint** - Code quality and consistency

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Backend API running on `http://localhost:8000`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   
   Update the backend URL in `src/services/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: "http://localhost:8000/", // Your backend URL
   });
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
hackathon-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   │   └── AgenticSidebar.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── HouseHoldForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MyHouse.jsx
│   │   └── JoinCreateTeam.jsx
│   ├── services/        # API and external services
│   │   └── api.js       # Axios configuration
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Project dependencies
```

## 🔑 Key Features Explained

### Authentication Flow
- Users can sign up and log in through dedicated pages
- JWT tokens are stored in localStorage
- Automatic token injection for authenticated API requests

### AI Agent Integration
- Real-time message updates using long-polling
- 30-second timeout with automatic retry logic
- Agent messages displayed in a floating chat interface

### Household Management
- Create new households with custom details
- Join existing households using invite codes
- View and manage household members
- Track household activities on the dashboard

## 🔌 API Integration

The application communicates with a backend API at `http://localhost:8000`. Key endpoints include:

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /agent/messages/long-poll` - Real-time AI agent messages
- Household and team management endpoints

Authentication tokens are automatically included in requests via Axios interceptors.

## 🎨 Styling

The application uses custom CSS files for each component/page:
- Component-specific styles (e.g., `Login.css`, `Dashboard.css`)
- Global styles in `index.css`
- App-level styles in `App.css`

## 🧪 Development

### Environment Setup
1. Ensure the backend API is running
2. Update API URLs if using a different backend endpoint
3. Configure any environment-specific variables

### Code Quality
- ESLint is configured with React-specific rules
- React Hooks linting enabled
- Fast Refresh support for development

## 🚀 Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist` folder will contain optimized production files

3. Deploy to your preferred hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Or any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project was created for the AI House Hackathon.

## 👥 Team

Built with love for the AI House Hackathon

## 🐛 Troubleshooting

### Common Issues

**API Connection Issues**
- Verify backend is running on `http://localhost:8000`
- Check CORS configuration on the backend
- Ensure authentication tokens are valid

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

**Long Polling Not Working**
- Check network tab in browser DevTools
- Verify backend long-poll endpoint is accessible
- Check for any proxy/firewall issues

**Happy Hacking! 🎉**
