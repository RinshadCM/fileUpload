import React, { useState } from 'react';
import './Registration.css';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          {/* {error && <MDBAlert color='danger'>{error}</MDBAlert>} */}
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass='mb-4'
              label='Your Email'
              size='lg'
              id='form2'
              type='email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Password'
              size='lg'
              id='form3'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type='submit'>Register</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Registration;
