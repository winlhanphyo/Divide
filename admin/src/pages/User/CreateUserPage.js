import React from 'react';
import swal from 'sweetalert';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const CreateUserPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: ""
  });
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: ""
  });

  const validation = () => {
    const errorMsg = {
      firstName: "First Name is required",
      lastName: "Last Name is required",
      email: "Email is required",
      password: "Password is required",
      confirmPassword: "Confirm Password is required",
      type: "User Type is required"
    };

    const inputName = ["password", "confirmPassword"];
    const preFormData = formData;

    let preErrorForm = errorForm;
    let validate =  true;
    Object.keys(errorMsg).map((dist) => {
      if (formData[dist] && inputName.indexOf(dist) !== -1) {
        if (formData[dist] && ((dist === "password" && formData[dist] !== preFormData.confirmPassword) || (dist === "confirmPassword" && formData[dist] !== preFormData.password))) {
          preErrorForm[dist] = "Password and Confirm Password does not match";
          validate = false;
        }
      } else if (!formData[dist]) {
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else if (formData["password"].length < 10) {
        preErrorForm[dist] = "Password length must be at least 10 characters";
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });

    setErrorForm({...preErrorForm});
    return validate;
  }

  const addUser = (e) => {
    e.preventDefault();
    const validate = validation();
    if (validate) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("admin"));
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        created_user_id: user?.id
      };
      axios.post("/v1/user", data,
      {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((dist) => {
        console.log("Created User")
        setLoading(false);
        swal("Success", "User is created successfully", "success").then(() => {
          window.location.href = "/admin/user";
        });
      }).catch((err) => {
        swal("Oops!", "Create User API Error", "error");
        setLoading(false);
      });
    }
  }

  const cancelClick = (e) => {
    e.preventDefault();
    window.location.href="/admin/user";
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

    if (name.toLowerCase().indexOf("password") !== -1 && value && preFormData["password"] === preFormData['confirmPassword']) {
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
                    <h4 class="card-title">Create User</h4>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" name="firstName" className={errorForm?.firstName ? `form-control is-invalid` : `form-control`} value={formData.firstName} onChange={handleChange} id="firstName" placeholder="first name"/>
                        {errorForm.firstName ? (
                          <div class="invalid-feedback">{errorForm.firstName}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" name="lastName" className={errorForm?.lastName ? `form-control is-invalid` : `form-control`} value={formData.lastName} onChange={handleChange} id="lastName" placeholder="last name"/>
                        {errorForm.lastName ? (
                          <div class="invalid-feedback">{errorForm.lastName}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" name="email" className={errorForm?.email ? `form-control is-invalid` : `form-control`} value={formData.email} onChange={handleChange} id="email" placeholder="Email" />
                        {errorForm.email ? (
                          <div class="invalid-feedback">{errorForm.email}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" className={errorForm?.password ? `form-control is-invalid` : `form-control`} value={formData.password} onChange={handleChange} id="password" placeholder="Password" />
                        {errorForm.password ? (
                          <div class="invalid-feedback">{errorForm.password}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" className={errorForm?.confirmPassword ? `form-control is-invalid` : `form-control`} value={formData.confirmPassword} onChange={handleChange} id="confirmPassword" placeholder="Confirm Password" />
                        {errorForm.confirmPassword ? (
                          <div class="invalid-feedback">{errorForm.confirmPassword}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="type">Type</label>
                        <select className={errorForm?.type ? `custom-select is-invalid` : `custom-select`} id="type" name="type" value={formData.type} onChange={handleChange}>
                          <option value="" selected>Choose...</option>
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                        </select>
                        {errorForm.type ? (
                          <div class="invalid-feedback">{errorForm.type}</div>) : ''}
                      </div>

                      <button class="btn btn-primary mr-2" onClick={(e) => addUser(e)}>Add</button>
                      <button class="btn btn-light" onClick={(e) => cancelClick(e)}>Cancel</button>
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

export default CreateUserPage;