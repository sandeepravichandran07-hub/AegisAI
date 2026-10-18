import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SmokeSplashScreen from './components/SmokeSplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <SmokeSplashScreen>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SmokeSplashScreen>
    </BrowserRouter>
  );
}
