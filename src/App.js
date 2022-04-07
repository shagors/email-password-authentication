import './App.css';
import app from './firebase.init';
import {
  createUserWithEmailAndPassword,
  getAuth
} from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailBlur = e => {
    setEmail(e.target.value);
  }

  const handlePasswordBlur = e => {
    setPassword(e.target.value);
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
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
    })
    .catch(error => {
      console.error(error);
    })
    e.preventDefault();
  }

  return (
    <div className="">
      <div className='registration w-50 mx-auto mt-5'>
        <h1 className='text-center text-primary'>Please Register</h1>
        <Form Form noValidate validated={validated}
        onSubmit={handleFormSubmit}>
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
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
