// src/App.tsx
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import PerformanceDashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <PerformanceDashboard />
    </ThemeProvider>
  );
}

export default App;