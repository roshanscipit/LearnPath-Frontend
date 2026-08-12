import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./js/context/AuthContext";
import Navbar from "./js/components/Navbar";
import Footer from "./js/components/Footer";
import AuthCallback from "./js/components/AuthCallback";
import ProtectedRoute from "./js/components/ProtectedRoutes";
import Home from "./js/pages/Home";
import Login from "./js/pages/Login";
import Signup from "./js/pages/Signup";
import Dashboard from "./js/pages/Dashboard";
import Roles from "./js/pages/Roles";
import LearningPath from "./js/pages/LearningPath";
import ModuleContent from "./js/pages/ModuleContent";
import CareerAgent from "./js/pages/CareerAgent";
import Companies from "./js/pages/Companies";
import CompanyDetail from "./js/pages/ComapanyDetails";
import MockTests from "./js/pages/MockTests";
import PaidServices from "./js/pages/PaidServices";
import UserProfile from "./js/pages/UserProfile";
import HelpPage from "./js/pages/HelpPage";
import AdminLogin from "./js/pages/AdminLogin";
import AdminDashboard from "./js/pages/AdminDashboard";
import { Toaster } from "./js/components/ui/toaster";

function AppRouter() {
  const location = useLocation();

  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  // Routes that hide the Navbar/Footer
  const noLayout = ["/login", "/signup", "/admin/login", "/admin/dashboard"];
  const showLayout = !noLayout.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {showLayout && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/company/:companyId" element={<CompanyDetail />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/paid-services" element={<PaidServices />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Protected (user) */}
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/role/:roleId"  element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/role/:roleId/:moduleId"  element={<ProtectedRoute><ModuleContent /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/career-agent"  element={<ProtectedRoute><CareerAgent /></ProtectedRoute>} />
        <Route path="/help"          element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      </Routes>
      {showLayout && <Footer />}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
