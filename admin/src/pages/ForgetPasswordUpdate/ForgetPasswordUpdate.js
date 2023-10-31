import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import swal from 'sweetalert';
import styles from './ForgetPasswordUpdate.module.scss';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const ForgetPasswordUpdate = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    newPassword: '',
    comfirmNewPassword: ''
  });
  const [errorForm, setErrorForm] = React.useState({
    newPassword: '',
    comfirmNewPassword: '',
  });
  const { token, userId } = useParams();
  const [showPassword, setShowPassword] = React.useState(false);


  const validation = (error = true) => {
    const keys = ["newPassword", "comfirmNewPassword"];

    let preErrorForm = errorForm;
    let validate = true;
    keys.map((dist) => {
      let value = formData[dist];
      if (dist === 'newPassword') {
        if (!value) {
          preErrorForm[dist] = 'New Password is required';
          validate = false;
        } else if (value.length < 10) {
          preErrorForm[dist] = 'New Password must be greater than 10';
          validate = false;
        }
      }
      if (dist === 'comfirmNewPassword') {
        if (!value) {
          preErrorForm[dist] = 'Comfirm Password is required';
          validate = false;
        } else if (value.length < 10) {
          preErrorForm[dist] = 'Comfirm Password must be greater than 10';
          validate = false;
        } else if (value !== formData.newPassword) {
          preErrorForm["comfirmNewPassword"] = 'Comfirm Password not equal with New Password';
          preErrorForm["newPassword"] = 'New Password not equal with Confirm Password';
          validate = false;
        }
      }
    });
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
      const param = {
        password: formData.newPassword
      };
      axios.post(`/password-reset-update/${userId}/${token}`, param).then(response => {
        setLoading(false);
        if (response.status === 200) {
          swal("Success", "Password is reset successfully", "success").then(() => {
            window.location.href = "/admin/login";
          });
        }
      }).catch(err => {
        setLoading(false);
        swal("Oops!", "Password Reset API Error", "error");
      });
    } else {
      setLoading(false);
    }
  }

  const handleChangeShowPassword = (event) => {
    const checked = event.target.checked;
    setShowPassword(checked);
  }

  return (
    <Fragment>
      <video autoPlay loop muted className={loading ? styles.backdrop + ' shadow ' + styles.videoBg : styles.videoBg}>
        <source src='../../../login/login.mp4' type='video/mp4'></source>
      </video>

      {loading && <LoadingSpinner />}

      <div className={loading ? styles.container + ' shadow ' + styles.backdrop : styles.container}>
        <p className={styles.ForgetPasswordUpdateTtl}>Change Password</p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              required
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.formControl}
              isValid={!errorForm.newPassword}
              isInvalid={errorForm.newPassword}
            />
            {errorForm.newPassword ? (
              <span className='text-danger mt-4'>{errorForm.newPassword}</span>) : ''}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              required
              name="comfirmNewPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={formData.comfirmNewPassword}
              onChange={handleChange}
              className={styles.formControl}
              isValid={!errorForm.comfirmNewPassword}
              isInvalid={errorForm.comfirmNewPassword}
            />
            {errorForm.comfirmNewPassword ? (
              <span className='text-danger mt-4'>{errorForm.comfirmNewPassword}</span>) : ''}
          </Form.Group>
          <Form.Group>
          <div key={`default-checkbox}`} className="mb-3">
            <Form.Check
              type="checkbox"
              id={`default-checkbox}`}
              label={`Show Password`}
              onChange={handleChangeShowPassword}
              value={showPassword}
            />
          </div>
          </Form.Group>
          
          <div className="d-flex justify-content-around mt-5">
            <Button onClick={handleClick} className={styles.forgetBtn}>
              Change
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

export default ForgetPasswordUpdate;
