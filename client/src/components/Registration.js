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

      // If the response is successful, you can clear the form fields and set the error message to an empty string.
      setUsername('');
      setPassword('');
      setError('Registration successful!');
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  const Login= ()=>{
    window.location.href = '/';
  }

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          {error && <p className="text-info">{error}</p>}
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
            <MDBBtn onClick={Login} className='mb-4 w-100 gradient-custom-5' size='lg' type=''>Login</MDBBtn>

          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Registration;
