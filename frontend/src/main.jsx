// Import StrictMode to help highlight potential problems in your app (optional but good during development)
import { StrictMode } from 'react'

// Import createRoot to render React app in root DOM node (new in React 18+)
import { createRoot } from 'react-dom/client'

// Import the main CSS file for global styles
import './index.css'

// Import the main App component (your entire application)
import App from './App.jsx'

// Import BrowserRouter to enable routing (navigating between pages)
import { BrowserRouter } from 'react-router-dom'

// Import Redux Provider to give access to the Redux store in the entire app
import { Provider } from "react-redux"

// Import the Redux store (global state)
import { store } from './redux/store.js'

// Define the base URL of your backend server (used in API calls throughout the app)
// export const serverUrl = "http://localhost:8000"
export const serverUrl = "https://chat-application-backend-r7m9.onrender.com"

// Render the React app inside the HTML element with id="root"
createRoot(document.getElementById('root')).render(
  
  // Wrap entire app with BrowserRouter to enable routing
  <BrowserRouter>

    {/* Wrap app with Redux Provider so that all components can access the Redux store */}
    <Provider store={store}>
    
      {/* Render the main App component */}
      <App />

    </Provider>
    
  </BrowserRouter>
)
