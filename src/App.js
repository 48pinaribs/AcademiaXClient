import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Account/Login';
import Register from './Pages/Account/Register';
import StudentDashboard from './Pages/Student/Styles/StudentDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/StudentDashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
