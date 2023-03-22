import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBFile,
} from 'mdb-react-ui-kit';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('code', code); // add code value to form data

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('User not authenticated');
        } else {
          throw new Error('Upload failed');
        }
      }

      const data = await response.json();
      setCode(data.code);
    } catch (err) {
      console.error(err);
    }
  };
  const View= ()=>{
    const id=localStorage.getItem('userId')
    window.location.href = `/files/${id}`;
  }


  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol lg='9' className='my-5'>
          <h1 className='text-white mb-4'>Apply for a job</h1>
          <MDBCard>
            <MDBCardBody className='px-4'>
              <form onSubmit={handleSubmit}>
                <MDBRow className='align-items-center pt-4 pb-3'>
                  <MDBCol md='3' className='ps-5'>
                    <h6 className='mb-0'>Upload File</h6>
                  </MDBCol>
                  <MDBCol md='9' className='pe-5'>
                    <MDBFile
                      size='lg'
                      id='customFile'
                      onChange={handleFileChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr className='mx-n3' />
                <MDBBtn className='my-4' size='lg' type='submit'>
                  Upload
                </MDBBtn>
              </form>
              {code && (
                <>
                  <hr className='mx-n3' />
                  <MDBInput
                    label='Your unique code'
                    type='text'
                    value={code}
                    readOnly
                  />
                </>
              )}

              <MDBBtn onClick={View} className='my-4' size='lg' type=''>
                View Previous Uploads
              </MDBBtn>
              {error && (
                <>
                  <hr className='mx-n3' />
                  <div className='alert alert-danger' role='alert'>
                    {error}
                  </div>
                </>
              )}
            </MDBCardBody>

          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default UploadFile;
