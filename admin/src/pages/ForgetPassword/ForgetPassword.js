import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import styles from './ForgetPassword.module.scss';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from "../../axios/index";

const ForgetPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
  });
  const [errorForm, setErrorForm] = React.useState({
    email: '',
  });
  const history = useHistory();

  const validation = (error=true) => {
    let preErrorForm = errorForm;
    let validate = true;
    let value = formData.email;
    if (!value) {
      validate = false;
      if (error) {
        preErrorForm.email = 'Email is required';
      }
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      validate = false;
      if (error) {
        preErrorForm.email = 'Email Format is required';
      }
    }
    setErrorForm({ ...preErrorForm });
    return validate;
  }

  /**
   * handle textbox change register button disabled enabled.
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
      let currentUrl = window.location.href;
      let domain = currentUrl.split("/admin/forget-password")[0];
      let param = formData;
      param.domainUrl = domain + "/admin";
      axios.post('/forget-password', param).then((response) => {
        console.log(response);
        setLoading(false);
        swal("Success", "Password Reset link is sent to your email successfully", "success").then(() => {
          let preFormData = formData;
          preFormData.email = "";
          setFormData({ ...preFormData });
        });
      }).catch((error) => {
        setLoading(false);
        swal("Oops!", "Email does not exists", "error");
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

      {loading && <LoadingSpinner text="Sending email... " />}

      <div className={loading ? styles.container + ' shadow ' + styles.backdrop : styles.container}>
        <p className={styles.forgetPasswordTtl}>Forgot your password?</p>
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
          <div className="d-flex justify-content-around mt-5">
            <Button onClick={handleClick} className={styles.forgetBtn}>
              Submit
            </Button>
          </div>
          <div className="d-flex justify-content-around mt-3">
            <a href="/admin/login" className={styles.backToLogin}>Back to Login</a>
          </div>
        </Form>
      </div>
    </Fragment>
  )
}

export default ForgetPassword;
