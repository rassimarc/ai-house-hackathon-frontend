import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup';
import HouseholdForm from './pages/HouseHoldForm';
// import Dashboard from './pages/Dashboard';
import Dashboard from './pages/Dashboard';
import MyHouse from './pages/MyHouse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/household" element={<HouseholdForm />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/house" element={<MyHouse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;