import React from 'react';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const EditOrderPage = () => {
  const param = useParams();
  const [loading, setLoading] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState({
    customerFirstName: "",
    customerLastName: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    status: ""
  });
  const [formData, setFormData] = React.useState({
    customerFirstName: "",
    customerLastName: "",
    accountName: "",
    email: "",
    country: "",
    company: "",
    address: "",
    additionalInfo: "",
    city: "",
    postalCode: "",
    phone: "",
    status: "",
    paymentDone: "false"
  });

  React.useEffect(() => {
    let id = param['id'];
    setLoading(true);
    axios.get(`/v1/order/${id}`).then((dist) => {
      setFormData({
        customerFirstName: dist?.data?.data?.firstName,
        customerLastName: dist?.data?.data?.lastName,
        accountName: dist?.data?.data?.customerData?.firstName + " " + dist?.data?.data?.customerData?.lastName,
        email: dist?.data?.data?.customer?.email,
        country: dist?.data?.data?.country,
        company: dist?.data?.data?.company,
        address: dist?.data?.data?.address,
        additionalInfo: dist?.data?.data?.additionalInfo,
        city: dist?.data?.data?.city,
        postalCode: dist?.data?.data?.postalCode,
        phone: dist?.data?.data?.phone,
        status: dist?.data?.data?.status,
        paymentDone: dist?.data?.data?.paymentDone
      });
      setLoading(false);
    }).catch((err) => {
      swal("Oops!", "Get Order API Error", "error");
      setLoading(false);
    })
  }, []);

  const validation = () => {
    const errorMsg = {
      customerFirstName: "Delivery First Name is required",
      customerLastName: "Delivery Last Name is required",
      country: "Country is required",
      address: "Address is required",
      city: "City is required",
      postalCode: "Postal code is required",
      phone: "Phone is required"
    };

    let preErrorForm = errorForm;
    let validate = true;
    Object.keys(errorMsg).map((dist) => {
      if ((dist === "count" && Number(formData[dist]) < 0) || !formData[dist]) {
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });
    setErrorForm({ ...preErrorForm });
    return validate;
  }

  const updateOrder = (e) => {
    e.preventDefault();
    const validate = validation();
    console.log('validate', validate);
    if (validate) {
      setLoading(true);
      let id = param['id'];
      const user = JSON.parse(localStorage.getItem("admin"));
      const data = {
        firstName: formData.customerFirstName,
        lastName: formData.customerLastName,
        country: formData.country,
        company: formData.company,
        address: formData.address,
        additionalInfo: formData.additionalInfo,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        status: formData.status,
        paymentDone: formData.paymentDone,
        updated_user_id: user.id
      };
      axios.post(`/v1/order/update/${id}`, data).then((dist) => {
        setLoading(false);
        swal("Success", "Order is updated successfully", "success").then(() => {
          window.location.href = "/admin/order";
        });
      }).catch((err) => {
        setLoading(false);
        swal("Oops!", err.toString(), "error");
      })
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
    if (preFormData[name] && preErrorForm[name]) {
      preErrorForm[name] = null;
      setErrorForm({ ...preErrorForm });
    }
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
                    <h4 class="card-title">Update Order</h4>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="customerFirstName">Customer First Name</label>
                        <input type="text" name="customerFirstName" className={errorForm?.customerFirstName ? `form-control is-invalid` : `form-control`} value={formData.customerFirstName} onChange={handleChange} id="customerFirstName" placeholder="Customer First name" />
                        {errorForm.customerFirstName ? (
                          <div class="invalid-feedback">{errorForm.customerFirstName}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="customerLastName">Customer Last Name</label>
                        <input type="text" name="customerLastName" className={errorForm?.customerLastName ? `form-control is-invalid` : `form-control`} value={formData.customerLastName} onChange={handleChange} id="customerLastName" placeholder="Customer Last name" />
                        {errorForm.customerLastName ? (
                          <div class="invalid-feedback">{errorForm.customerLastName}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="accountName">Account Name</label>
                        <input type="text" disabled name="accountName" className={errorForm?.accountName ? `form-control is-invalid` : `form-control`} value={formData.accountName} onChange={handleChange} id="accountName" placeholder="account name" />
                      </div>

                      <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" disabled name="email" className={errorForm?.email ? `form-control is-invalid` : `form-control`} value={formData.email} onChange={handleChange} id="email" placeholder="email" />
                      </div>

                      <div class="form-group">
                        <label for="country">Country</label>
                        <input type="text" name="country" className={errorForm?.country ? `form-control is-invalid` : `form-control`} value={formData.country} onChange={handleChange} id="country" placeholder="country" />
                        {errorForm.country ? (
                          <div class="invalid-feedback">{errorForm.country}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="company">Company</label>
                        <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} id="company" placeholder="Company" />
                      </div>

                      <div class="form-group">
                        <label for="address">Address</label>
                        <textarea className={errorForm?.address ? `form-control is-invalid` : `form-control`} id="address" rows="3" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        {errorForm.address ? (
                          <div class="invalid-feedback">{errorForm.address}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="additionalInfo">Additional Info</label>
                        <input type="text" name="a" className="form-control" value={formData.additionalInfo} onChange={handleChange} id="additionalInfo" placeholder="Additional Info" />
                      </div>

                      <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" name="city" className={errorForm?.city ? `form-control is-invalid` : `form-control`} value={formData.city} onChange={handleChange} id="city" placeholder="City" />
                        {errorForm.city ? (
                          <div class="invalid-feedback">{errorForm.city}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="postalCode">Postal Code</label>
                        <input type="text" name="a" className={errorForm?.postalCode ? `form-control is-invalid` : `form-control`} value={formData.postalCode} onChange={handleChange} id="postalCode" placeholder="Postal Code" />
                        {errorForm.postalCode ? (
                          <div class="invalid-feedback">{errorForm.postalCode}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="text" name="a" className={errorForm?.phone ? `form-control is-invalid` : `form-control`} value={formData.phone} onChange={handleChange} id="phone" placeholder="Phone" />
                        {errorForm.phone ? (
                          <div class="invalid-feedback">{errorForm.phone}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="status">Status</label>
                        <select className={errorForm?.status ? `custom-select is-invalid` : `custom-select`} id="status" name="status" value={formData.status} onChange={handleChange}>
                          <option value="new">new</option>
                          <option value="shipping">shipping</option>
                          <option value="delivered">delivered</option>
                        </select>
                        {errorForm.status ? (
                          <div class="invalid-feedback">{errorForm.status}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="paymentDone">Payment</label>
                        <select className={`custom-select`} id="paymentDone" name="paymentDone" value={formData.paymentDone} onChange={handleChange}>
                          <option value="true">Done</option>
                          <option value="false">Not Paid</option>
                        </select>
                        {errorForm.status ? (
                          <div class="invalid-feedback">{errorForm.status}</div>) : ''}
                      </div>

                      <button class="btn btn-primary mr-2" onClick={(e) => updateOrder(e)}>Update</button>
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

export default EditOrderPage;