import React from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function ViewFiles() {
  return (
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Filename</th>
          <th scope='col'>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          
          <td>
            <p className='fw-normal mb-1'>File name</p>
          </td>
         
          <td>
            <MDBBtn  color='link' rounded size='sm'>
              Delete
            </MDBBtn>
            <MDBBtn color='link' rounded size='sm'>
              Download
            </MDBBtn>
          </td>
        </tr>
       
      </MDBTableBody>
    </MDBTable>
  );
}