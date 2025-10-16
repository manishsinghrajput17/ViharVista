// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AboutPage from './pages/AboutPage';
import Footer from './components/Footer';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
// import AdminDashboard from './pages/AdminDashboard';
import { Navigate } from 'react-router-dom';
import './App.css'; // For general layout
import 'leaflet/dist/leaflet.css';
import { ManageDestinationsPage } from './Admin/ManageDestinations';
import EditDestination from './Admin/EditDestinationPage';
import AddDestination from './Admin/AddDestinationPage';
// import {AddDestination} from './Admin/AddDestinations';
// import {ManageCardDetails} from './Admin/ManageCardDetails';

function App() {

  // 🔒 Route protection helpers
  const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading) return <p>Loading...</p>;
    return user ? children : <Navigate to="/login" replace />;
  };

  const AdminRoute = ({ children }) => {
    const { user, role, authLoading } = useAuth();
    if (authLoading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (role !== "admin") return <Navigate to="/" replace />;
    return children;
  };
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <div className="app-container">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
                 <Route path="/favorites" element={<FavoritesPage />} />

                {/* Protected user routes */}
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <FavoritesPage />
                    </PrivateRoute>
                  }
                />

                {/* Auth pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Admin-only route */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <AdminRoute>
                      <ManageDestinationsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/edit-destination/:id"
                  element={
                    <AdminRoute>
                      <EditDestination />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/add-destination"
                  element={
                    <AdminRoute>
                      <AddDestination />
                    </AdminRoute>
                  }
                />  

                {/* Optional: 404 fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;