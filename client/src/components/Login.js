import React, { useState } from 'react';
import './Registration.css'
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
from 'mdb-react-ui-kit';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
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

      // If the response is successful, you can get the token from the response and save it to local storage.
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);

      // Set login status to "success"
      setLoginStatus('success');

      // You can then redirect the user to a new page or perform any other actions you want.
      window.location.href = '/upload';
    } catch (err) {
      setError(err.message);

      // Set login status to "failure"
      setLoginStatus('failure');
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)'}}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{maxWidth: '600px'}}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Login</h2>
          {loginStatus === 'success' && <p className="text-success">Login successful!</p>}
          {loginStatus === 'failure' && <p className="text-danger">Incorrect username or password.</p>}
          <form onSubmit={handleSubmit}>
            <MDBInput wrapperClass='mb-4' label='Your Email' size='lg' id='form2' type='email' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type='submit'>Login</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
