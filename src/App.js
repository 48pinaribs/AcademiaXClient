import './App.css';
import './styles/theme.css';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
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
import SelectCourse from './Components/SelectCourse';
import EnrolledCourse from './Components/EnrolledCourse';
import TeacherCourse from './Components/TeacherCourse';
import CourseDetail from './Components/CourseDetail';
import StudentHomePage from './Pages/Student/StudentHomePage';
import AddTeacher from './Pages/Admin/AddTeacher';
import ProtectedRoute from './Components/ProtectedRoute';
import ErrorBoundary from './Components/ErrorBoundary';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import TeacherDashboard from './Pages/Teacher/TeacherDashboard';
import TeacherGradeEntry from './Pages/Teacher/TeacherGradeEntry';
import TeacherAttendanceTaking from './Pages/Teacher/TeacherAttendanceTaking';
import StudentDashboard from './Pages/Student/StudentDashboard';
import StudentGrades from './Pages/Student/StudentGrades';
import StudentAttendance from './Pages/Student/StudentAttendance';
import Announcements from './Pages/Announcements';

// Ant Design ve MUI, AcademiaX'in mor tasarım sistemine göre yeniden temalandırılıyor
// (bkz. tasarım onayı) — her sayfayı tek tek yeniden yazmak yerine, mevcut antd/MUI
// bileşenleri bu iki provider üzerinden tutarlı renk/tipografi alıyor.
const antdTheme = {
  token: {
    colorPrimary: '#6E3F92',
    colorLink: '#6E3F92',
    colorSuccess: '#2F6D4F',
    colorWarning: '#96751A',
    colorError: '#A13B33',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgLayout: '#F8F6FB',
  },
};

const muiTheme = createTheme({
  palette: {
    primary: { main: '#6E3F92' },
    secondary: { main: '#8A56AE' },
    background: { default: '#F8F6FB' },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={muiTheme}>
    <AntdConfigProvider theme={antdTheme}>
    <ErrorBoundary>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            {/* Giriş yapmış herkes erişebilir, role özel değil */}
            <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/profilepage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/userdetail/:userId" element={<ProtectedRoute allowedRoles={["Administrator", "Teacher"]}><UserDetail /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />

            {/* Administrator */}
            <Route path='/admin/dashboard' element={<ProtectedRoute allowedRoles={["Administrator"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path='/admin/addcourse' element={<ProtectedRoute allowedRoles={["Administrator"]}><AddCourse /></ProtectedRoute>} />
            <Route path='/admin/addteacher' element={<ProtectedRoute allowedRoles={["Administrator"]}><AddTeacher /></ProtectedRoute>} />
            <Route path="/admin/courseeditform/:courseId" element={<ProtectedRoute allowedRoles={["Administrator"]}><CourseEditForm /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={["Administrator"]}><AdminTeacherPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["Administrator"]}><AdminStudentPage /></ProtectedRoute>} />
            <Route path='/admin/courses' element={<ProtectedRoute allowedRoles={["Administrator"]}><AdminCoursePage /></ProtectedRoute>} />

            {/* Teacher / Administrator */}
            <Route path='/teacher/dashboard' element={<ProtectedRoute allowedRoles={["Teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path='/teacher/grades' element={<ProtectedRoute allowedRoles={["Teacher", "Administrator"]}><TeacherGradeEntry /></ProtectedRoute>} />
            <Route path='/teacher/attendance' element={<ProtectedRoute allowedRoles={["Teacher", "Administrator"]}><TeacherAttendanceTaking /></ProtectedRoute>} />
            <Route path="/teachercourse" element={<ProtectedRoute allowedRoles={["Teacher", "Administrator"]}><TeacherCourse /></ProtectedRoute>} />
            {/* Not: eskiden ayrı bir /coursestudents rotası vardı ama courseId hiç geçilmiyordu (kırıktı).
                Öğrenci listesi artık CourseDetail (/courses/:id) içine gömülü — TeacherCourse'daki
                "Detay" butonu oraya yönlendiriyor. */}

            {/* Student */}
            <Route path='/student/dashboard' element={<ProtectedRoute allowedRoles={["Student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path='/student/grades' element={<ProtectedRoute allowedRoles={["Student"]}><StudentGrades /></ProtectedRoute>} />
            <Route path='/student/attendance' element={<ProtectedRoute allowedRoles={["Student"]}><StudentAttendance /></ProtectedRoute>} />
            <Route path="/selectcourse" element={<ProtectedRoute allowedRoles={["Student"]}><SelectCourse /></ProtectedRoute>} />
            <Route path="/enrolledcourse" element={<ProtectedRoute allowedRoles={["Student"]}><EnrolledCourse /></ProtectedRoute>} />
            <Route path='/studenthomepage' element={<ProtectedRoute allowedRoles={["Student"]}><StudentHomePage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
    </AntdConfigProvider>
    </MuiThemeProvider>
  );
}

export default App;
