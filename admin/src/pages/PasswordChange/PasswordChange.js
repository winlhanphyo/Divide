import React from 'react';
import swal from 'sweetalert';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const PasswordChange = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = React.useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const validation = () => {
    const errorMsg = {
      password: "Old Password is required",
      newPassword: "New Password is required",
      confirmPassword: "Confirm Password is required"
    };

    const inputName = ["password", "confirmPassword"];
    const preFormData = formData;

    let preErrorForm = errorForm;
    let validate = true;
    Object.keys(errorMsg).map((dist) => {
      if (formData[dist] && inputName.indexOf(dist) !== -1) {
        if (formData[dist] && ((dist === "newPassword" && formData[dist] !== preFormData.confirmPassword) || (dist === "confirmPassword" && formData[dist] !== preFormData.newPassword))) {
          preErrorForm[dist] = "New Password and Confirm Password does not match";
          validate = false;
        }
      } else if (!formData[dist]) {
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });

    setErrorForm({ ...preErrorForm });
    return validate;
  }

  const changePassword = (e) => {
    e.preventDefault();
    const validate = validation();
    if (validate) {
      const user = JSON.parse(localStorage.getItem("admin"));
      const data = {
        password: formData.password,
        newPassword: formData.newPassword
      };
      setLoading(true);
      axios.post(`v1/user/password-change/${user.id}`, data).then((dist) => {
        console.log("New Password changed!")
        setLoading(false);
        swal("Success", "New Password changed successfully", "success").then(() => {
          window.location.href = "/admin/user";
        });
      }).catch((err) => {
        swal("Oops!", err.toString(), "error");
        setLoading(false);
      });
    }
  }

  /**
  * handle textbox change register button disabled enabled.
  */
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let preFormData = formData;
    const preErrorForm = errorForm;
    preFormData[name] = value;
    setFormData({ ...preFormData });
    if (value && preFormData["password"] === preFormData['confirmPassword']) {
      preErrorForm.password = null;
      preErrorForm.confirmPassword = null;
    } else if (preFormData[name] && preErrorForm[name]) {
      preErrorForm[name] = null;
    }
    setErrorForm({
      ...preErrorForm
    });
  };

  return (
    <div class="container-scroller">
      <Header />
      {loading && <LoadingSpinner />}
      <div class="page-body-wrapper">
        <Sidebar />
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="row">
              <div class="col-md-12 stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Password Change</h4>
                    <form class="forms-sample">

                      <div class="form-group">
                        <label for="password">Old Password</label>
                        <input type="password" name="password" className={errorForm?.password ? `form-control is-invalid` : `form-control`} value={formData.password} onChange={handleChange} id="password" placeholder="Old Password" />
                        {errorForm.password ? (
                          <div class="invalid-feedback">{errorForm.password}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="password">New Password</label>
                        <input type="password" name="newPassword" className={errorForm?.newPassword ? `form-control is-invalid` : `form-control`} value={formData.newPassword} onChange={handleChange} id="password" placeholder="New Password" />
                        {errorForm.newPassword ? (
                          <div class="invalid-feedback">{errorForm.newPassword}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" className={errorForm?.confirmPassword ? `form-control is-invalid` : `form-control`} value={formData.confirmPassword} onChange={handleChange} id="confirmPassword" placeholder="Confirm Password" />
                        {errorForm.confirmPassword ? (
                          <div class="invalid-feedback">{errorForm.confirmPassword}</div>) : ''}
                      </div>

                      <button class="btn btn-primary mr-2" onClick={(e) => changePassword(e)}>Change</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- content-wrapper ends -->
        <!-- partial:partials/_footer.html --> */}
          <footer class="footer">
            <div class="d-sm-flex justify-content-center justify-content-sm-between">
              <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2018 <a href="https://www.urbanui.com/" target="_blank">Urbanui</a>. All rights reserved.</span>
              <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted & made with <i class="mdi mdi-heart text-danger"></i></span>
            </div>
          </footer>
          {/* <!-- partial --> */}
        </div>
        {/* <!-- main-panel ends --> */}
      </div>
      {/* <!-- page-body-wrapper ends --> */}
    </div>

  )
}

export default PasswordChange;