import './App.css';
import app from './firebase.init';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameBlur = e => {
    setName(e.target.value);
  }

  const handleEmailBlur = e => {
    setEmail(e.target.value);
  }

  const handlePasswordBlur = e => {
    setPassword(e.target.value);
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked)
  }

  const handleFormSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!/(?=.*?[0-9])/.test(password)){
      setError('Password should contain one special character');
      return;
    }
    setValidated(true);
    setError('');

    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }

    e.preventDefault();
  }

  const handlePasswordReset = e => {
    sendPasswordResetEmail(auth, email)
    .then(()=>{
      console.log('email sent');
    })
    .catch()
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName : name
    })
    .then(() => {
      console.log('Create name');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then( () => {
      console.log('Email verification sent');
    })
  }

  return (
    <div className="">
      <div className='registration w-50 mx-auto mt-5'>
        <h1 className='text-center text-primary'>Please { registered ? 'Login' : 'Register'}</h1>
        <Form noValidate validated={validated}
        onSubmit={handleFormSubmit}>
          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your Name" required />
            <Form.Control.Feedback type="invalid">
              Please provide Your Name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered ?" />
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="link">Forget Password</Button>
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Registered'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
