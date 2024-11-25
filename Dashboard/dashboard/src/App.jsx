import './App.css'
import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ManageSkills from './pages/ManageSkills'
import ManageTimeline from './pages/ManageTimeline'
import ViewProject from './pages/ViewProject'
import UpdateProject from './pages/UpdateProject'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
 <>
 <Router>
  <Routes>
    <Route path='/' element={<HomePage/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/password/forgot' element={<ForgotPassword/>} />
    <Route path='/password/reset/:token' element={<ResetPassword/>} />
    <Route path='/manage/skills' element={<ManageSkills/>} />
    <Route path='/manage/timeline' element={<ManageTimeline/>} />
    <Route path='/view/project/:id' element={<ViewProject/>} />
    <Route path='/update/project/:id' element={<UpdateProject/>} />
  </Routes>
  <ToastContainer position='bottom-right' theme='dark'/>
 </Router>
 </>
  )
}

export default App
