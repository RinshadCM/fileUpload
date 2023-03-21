import React, { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function ViewFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`/files/${userId}`)
        .then(res => res.json())
        .then(data => setFiles(data))
        .catch(err => console.error(`Error fetching files: ${err}`));
    }
  }, []);


  const handleDelete = (code) => {
    fetch(`/file/${code}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setFiles(files.filter(file => file.code !== code));
        }
      })
      .catch(err => console.error(`Error deleting file: ${err}`));
  };

  const handleDownload = (code) => {
    window.open(`/download/${code}`);
  };

  return (
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Filename</th>
          <th scope='col'>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {files.map(file => (
          <tr key={file.code}>
            <td>
              <p className='fw-normal mb-1'>{file.filename}</p>
              <MDBBadge bg='secondary'>{file.code}</MDBBadge>
            </td>
            <td>
              <MDBBtn color='link' rounded size='sm' onClick={() => handleDelete(file.code)}>
                Delete
              </MDBBtn>
              <MDBBtn color='link' rounded size='sm' onClick={() => handleDownload(file.code)}>
                Download
              </MDBBtn>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
