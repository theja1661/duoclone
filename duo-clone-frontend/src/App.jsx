import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import CourseEnroll from './pages/CourseEnroll'
import CourseContinue from './pages/CourseContinue'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import NewCourse from './pages/NewCourse'
import EditCourse from './pages/EditCourse'
import AdminCourseView from './pages/AdminCourseView'
import UserView from './pages/UserView'
import './App.css'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course-enroll/:id" element={<CourseEnroll />} />
        <Route path="/course-continue/:id" element={<CourseContinue />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new-course" element={<NewCourse />} />
        <Route path="/admin/edit-course/:id" element={<EditCourse />} />
        <Route path="/admin/course/:id" element={<AdminCourseView />} />
        <Route path="/admin/user/:id" element={<UserView />} />
      </Routes>
    </HashRouter>
  )
}

export default App
