import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Account/Login';
import Register from './Pages/Account/Register';
import Layout from './Layout/Layout';
import AdminCoursePage from './Pages/Admin/AdminCoursePage';
import AdminStudentPage from './Pages/Admin/AdminStudentPage';
import AdminTeacherPage from './Pages/Admin/AdminTeacherPage';
import CourseEditForm from './Components/CourseEditForm';
import ProfilePage from './Components/ProfilePage';
import UserDetail from './Components/UserDetail';
import AddCourse from './Components/AddCourse';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path='/admin/addcourse' element={<AddCourse />} />
          <Route path="/userdetail/:userId" element={<UserDetail />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/admin/courseeditform/:courseId" element={<CourseEditForm />} />
          <Route path="/admin/teachers" element={<AdminTeacherPage />} />
          <Route path="/admin/students" element={<AdminStudentPage />} />
          <Route path='/admin/courses' element={<AdminCoursePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
