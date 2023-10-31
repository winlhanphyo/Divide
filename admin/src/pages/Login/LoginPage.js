import React, { Fragment} from 'react';
import { useHistory } from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import swal from 'sweetalert';
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../store/actions/types";
import styles from './LoginPage.module.scss';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const LoginPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [errorForm, setErrorForm] = React.useState({
    email: '',
    password: ''
  });
  const history = useHistory();
  const dispatch = useDispatch();

  const validation = (error=true) => {
    const keys = ["email", "password"];

    let preErrorForm = errorForm;
    let validate = true;
    keys.map((dist) => {
      let value = formData[dist];
      if (dist == 'email') {
        if (!value) {
          validate = false;
          if (error) {
            preErrorForm[dist] = 'Email is required';
          }
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          validate = false;
          if (error) {
            preErrorForm[dist] = 'Email Format is required';
          }
        }
      }
      if (dist == 'password') {
        if (!value) {
          validate = false;
          if (error) {
            preErrorForm[dist] = 'Password is required';
          }
        } else if (value.length < 10) {
          validate = false;
          if (error) {
            preErrorForm[dist] = 'Password must be greater than 10';
          }
        }
      }
    });
    console.log("preError", preErrorForm, validate);
    setErrorForm({ ...preErrorForm });
    return validate;
  }

  /**
   * handle textbox change register button.
   */
   const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let preFormData = formData;
    preFormData[name] = value;
    setFormData({ ...preFormData });
    const error = validation(false);
    let preErrorForm = errorForm;
    if (!error) {
      preErrorForm[name] = error;
      setErrorForm({
        ...preErrorForm
      });
    }
  };

  const handleClick = (event) => {
    event.preventDefault();

    const validate = validation();
    if (validate) {
      setLoading(true);
      axios.post('/login', formData).then((response) => {
        console.log(response);
        setLoading(false);
        if (response.status === 200) {
          const { data } = response;
          const token = data.token;
          const { user } = data;
          localStorage.setItem(
            "admin",
            JSON.stringify({
              accessToken: token,
              ...user
            })
          );
          /** store logged in user's info to App State */
          dispatch({
            type: LOGIN_SUCCESS,
            payload: {
              user: {
                accessToken: token,
                ...formData
              },
            }
          });
          history.push('/home');
        }
      }).catch((error) => {
        setLoading(false);
        swal("Oops!", "Email or Password name is incorrect.");
        console.log(error);
      });
    } else {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <video autoPlay loop muted className={loading ? styles.backdrop + ' shadow ' + styles.videoBg : styles.videoBg}>
        <source src='../../../login/login.mp4' type='video/mp4'></source>
      </video>

      {loading && <LoadingSpinner />}

      <div className={loading ? styles.container + ' shadow ' + styles.backdrop : styles.container }>
        <p className={styles.loginTtl}>Oscar Admin Login Form</p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              required
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formControl}
              isValid={!errorForm.email}
              isInvalid={errorForm.email}
            />
            {errorForm.email ? (
                <span className='text-danger mt-4'>{errorForm.email}</span>) : ''}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              required
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formControl}
              isValid={!errorForm.password}
              isInvalid={errorForm.password}
            />
            {errorForm.password ? (
            <span className='text-danger mt-4'>{errorForm.password}</span>) : ''}
          </Form.Group>
          <div className="mb-3 d-flex justify-content-end">
            <a href="/admin/forget-password" className={styles.forgotPwd}>Forgot Password?</a>
          </div>
          <div className="d-flex justify-content-around mt-5">
            <Button onClick={handleClick}  className={styles.loginBtn}>
              Log In
            </Button>
          </div>
        </Form>
      </div>

    </Fragment>
  )
}

export default LoginPage;
