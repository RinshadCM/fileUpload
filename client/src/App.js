import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import UploadFile from './components/UploadFile';
import ViewFiles from './components/ViewFiles';
// import DeleteFile from './components/DeleteFile';
// import DownloadFile from './components/DownloadFile';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/register" element={<Registration></Registration>} />
        <Route path="/upload" element={<UploadFile></UploadFile>} />
        <Route path="/files/:userId" element={<ViewFiles></ViewFiles>} />
        {/* <Route exact path="/delete" component={DeleteFile} />
        <Route exact path="/download" component={DownloadFile} /> */}
      </Routes>
    </Router>
  );
}

export default App;
