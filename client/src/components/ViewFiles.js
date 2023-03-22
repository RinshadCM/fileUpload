import React, { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Swal from 'sweetalert2'

export default function ViewFiles() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You need to log in to view your files.');
      return;
    }
    fetch(`http://localhost:3001/files/${userId}`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error(`Error fetching files: ${err}`));
  }, []);


  const handleDelete = (code) => {
    const userId = localStorage.getItem('userId');
    console.log(code);
    fetch(`http://localhost:3001/files/${userId}/${code}`, { method: 'delete' })
      .then(res => {
        if (res.ok) {
          setFiles(files.filter(file => file.code !== code));
        } else {
          throw new Error('Failed to delete file');
        }
      })
      .catch(err => console.error(`Error deleting file: ${err}`));
  };



  const handleDownload = async () => {
    const { value: code } = await Swal.fire({
      title: 'Enter code',
      input: 'text',
      inputPlaceholder: 'Enter 6-digit code',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a code';
        } else if (!/^\d{6}$/.test(value)) {
          return 'Code must be 6 digits';
        }
      },
    });

    if (code) {
      try {
        const response = await fetch(`http://localhost:3001/download/${code}`, {
          method: 'GET',
        });
        if (response.ok) {
          const blob = await response.blob();
          const contentType = response.headers.get('Content-Type');
          const extension = contentType.split('/')[1];
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${code}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          Swal.fire({
            title: 'Download failed',
            text: 'Incorrect code entered',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Download failed',
          text: 'An error occurred while downloading the file',
          icon: 'error',
        });
      }
    }
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
