import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import RequireAdmin from './components/common/RequireAdmin';
import RequireAuth from './components/common/RequireAuth';
import ToastProvider from './components/ui/ToastProvider';
import SiteThemeProvider from './context/SiteThemeContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ExperienceDetails from './pages/ExperienceDetails';
import NotFound from './pages/NotFound';


function App() {
  return (
    <SiteThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/experiences/:id" element={<ExperienceDetails />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <UserDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SiteThemeProvider>
  );
}

export default App;
