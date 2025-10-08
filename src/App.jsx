import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import CourseDetails from './Pages/CourseDetails';
import SuccessDialog from './Components/Dialogs/SuccessDialog';
import DashboardCourses from './Pages/DashboardCourses';
import CourseStep1 from './Pages/CourseStep1';
import CourseStep2 from './Pages/CourseStep2';
import ViewCourse from './Pages/ViewCourse';
import React, { useState } from "react";
import DashboardInstructors from './Pages/DashboardInstructors';
import { CourseProvider } from './Components/Context/CourseContext';
import { AuthProvider } from './Components/Context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingProvider } from './Components/Context/ShoppingContext';
import ProtectedRoute from './Components/ProtectedRoutes';
import { CheckoutPage } from './Pages/CheckoutPage';
import { ShoppingCartPage } from './Pages/ShoppingCartPage';
import { CourseListingPage } from './Pages/CourseListingPage'
import { InstructorProvider } from './Components/Context/InstructorContext';
import { CategoryProvider } from './Components/Context/CategoryContext';
function App() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    certification: "",
    image: null,
  });

  return (
    <>
      <Router>
        <AuthProvider>
          <ShoppingProvider>
            <CourseProvider>
              <InstructorProvider>
                <CategoryProvider>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />

                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/courses"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <DashboardCourses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/instructors"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <DashboardInstructors />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='/courses' element={<CourseListingPage />} />
                    <Route path='/course/:id' element={<CourseDetails />} />
                    <Route path='/success' element={<SuccessDialog />} />

                    <Route path="/dashboard/courses/add/step1" element={<ProtectedRoute requiredRole="admin">
                      <CourseStep1 /> </ProtectedRoute>} />
                    <Route path="/dashboard/courses/add/step2" element={<ProtectedRoute requiredRole="admin"><CourseStep2 /> </ProtectedRoute>} />

                    <Route path="/dashboard/courses/update/:id/step1" element={<ProtectedRoute requiredRole="admin"><CourseStep1 /></ProtectedRoute>} />
                    <Route path="/dashboard/courses/update/:id/step2" element={<ProtectedRoute requiredRole="admin"><CourseStep2 /></ProtectedRoute>} />

                    <Route path="/dashboard/courses/view/:id" element={
                      <ProtectedRoute requiredRole="admin">
                        <ViewCourse /></ProtectedRoute>} />

                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage /></ProtectedRoute>} />

                    <Route path="/cart" element={
                      <ProtectedRoute >
                        <ShoppingCartPage /></ProtectedRoute>} />
                  </Routes>
                </CategoryProvider>
              </InstructorProvider>
            </CourseProvider>
          </ShoppingProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;