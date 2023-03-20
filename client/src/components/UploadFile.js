import React from 'react';
import './UploadFile.css'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBFile
}
from 'mdb-react-ui-kit';

function UploadFile() {
  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol lg='9' className='my-5'>

          <h1 class="text-white mb-4">Apply for a job</h1>

          <MDBCard>
            <MDBCardBody className='px-4'>

              

              <hr className="mx-n3" />

              <MDBRow className='align-items-center pt-4 pb-3'>

                <MDBCol md='3' className='ps-5'>
                  <h6 className="mb-0">Upload File</h6>
                </MDBCol>

                <MDBCol md='9' className='pe-5'>
                  <MDBFile size='lg' id='customFile' />
                  {/* <div className="small text-muted mt-2">Upload your CV/Resume or any other relevant file. Max file size 50 MB</div> */}
                </MDBCol>

              </MDBRow>

              <hr className="mx-n3" />

              <MDBBtn className='my-4' size='lg'>Upload</MDBBtn>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default UploadFile;