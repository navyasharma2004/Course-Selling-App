import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserAuth from "./pages/UserAuth";
import AdminAuth from "./pages/AdminAuth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursePlayer from "./pages/CoursePlayer";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserAuth />} />
            <Route path="/my-courses" element={<UserDashboard />} />
            <Route path="/learn/:courseId" element={<CoursePlayer />} />
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
