import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
// import RunSetup from './components/RunSetup';
import Dashboard from './components/Dashboard';
import EditRun from './components/EditRun';
import Settings from './components/Settings';
import SettingUpRun from './components/SettingUpRun';
import SignIn from './components/SignIn';

function App() {
  return (
    <BrowserRouter>
      {/* style={{ backgroundImage: `url(${bg})` }} */}
    <div className="background" >
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="*" element={<SignUp />} />
        {/* <Route path="/setup/:userId" element={<RunSetup />} /> */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/settingUpRun/:userId" element={<SettingUpRun />} />
        <Route path="/settingUpRun/:userId/:selectedDate" element={<SettingUpRun />} />
        <Route path="/settings/:userId" element={<Settings />} />
        <Route path="/editRun/:userId/:runId" element={<EditRun />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </div>
      
    </BrowserRouter>
    
  );
}

export default App;
