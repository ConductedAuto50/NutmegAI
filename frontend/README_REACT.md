# NutmegAI - React Frontend

This project has been converted from a Flask-based server-side rendered application to a modern React frontend with a Flask API backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install React dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with your API keys:
   ```env
   GSEARCH_API_KEY=your_google_search_api_key
   CSE_ID=your_custom_search_engine_id
   OPENAI_API_KEY=your_openai_api_key
   ```

### Development

1. **Start the Flask backend:**
   ```bash
   python main.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the React development server:**
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

### Production Build

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   python main.py
   ```
   The app will be available at `http://localhost:5000`

## 📁 Project Structure

```
NutmegAI/
├── src/                    # React source code
│   ├── components/         # Reusable React components
│   │   ├── Header.js      # Navigation header
│   │   ├── Background3D.js # Three.js background
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── HomePage.js    # Landing page
│   │   ├── ChatPage.js    # Chat interface
│   │   └── ...
│   ├── App.js             # Main app component
│   └── index.js           # React entry point
├── public/                # Static assets
├── build/                 # Production build (generated)
├── main.py               # Flask backend
├── package.json          # Node.js dependencies
└── requirements.txt      # Python dependencies
```

## 🔧 Key Features

### Frontend (React)
- **Modern UI/UX**: Beautiful, responsive design with animations
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Chart Integration**: Dynamic charts using Chart.js
- **3D Background**: Animated Three.js background
- **Mobile Responsive**: Optimized for all device sizes
- **Route Management**: Client-side routing with React Router

### Backend (Flask API)
- **RESTful API**: Clean API endpoints for frontend communication
- **CORS Support**: Cross-origin resource sharing enabled
- **Static File Serving**: Serves React build files in production
- **Legacy Support**: Backward compatibility with existing routes

## 🎨 UI Components

### Header Component
- Responsive navigation
- Mobile menu toggle
- Logo with 3D effects
- Smooth animations

### Chat Interface
- Real-time message display
- Typing indicators
- Chart rendering
- Auto-scroll to bottom
- Message animations

### Homepage
- Hero section with 3D elements
- Feature showcase
- Use case cards
- Call-to-action sections
- Smooth scroll animations

## 🔌 API Endpoints

### Chat API
- **POST** `/api/chat` - Send messages to the AI assistant
- **POST** `/chat_api` - Legacy endpoint (backward compatibility)

### Facts API
- **GET** `/api/facts` - Retrieve football facts

## 🛠️ Development Workflow

### Adding New Components
1. Create component in `src/components/`
2. Add corresponding CSS file
3. Import and use in pages

### Adding New Pages
1. Create page in `src/pages/`
2. Add route in `App.js`
3. Update navigation if needed

### Styling
- CSS variables for consistent theming
- Responsive design with mobile-first approach
- Smooth animations and transitions

## 🚀 Deployment

### Development
```bash
# Terminal 1 - Backend
python main.py

# Terminal 2 - Frontend
npm start
```

### Production
```bash
# Build React app
npm run build

# Start production server
python main.py
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask-CORS is installed and configured
2. **Build Errors**: Clear `node_modules` and reinstall dependencies
3. **API Connection**: Check that backend is running on port 5000
4. **Chart Rendering**: Ensure Chart.js dependencies are properly installed

### Performance Tips

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Enable production builds for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This React frontend maintains full compatibility with the existing Flask backend while providing a modern, responsive user experience. 