import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import UploadFile from './components/UploadFile';
import ViewFiles from './components/ViewFiles';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/register" element={<Registration></Registration>} />
        <Route path="/upload" element={<UploadFile></UploadFile>} />
        <Route path="/files/:userId" element={<ViewFiles></ViewFiles>} />
      </Routes>
    </Router>
  );
}

export default App;
