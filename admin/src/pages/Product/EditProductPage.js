import React from 'react';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import axios from '../../axios/index';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const EditProductPage = () => {
  const param = useParams();
  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  // const [initCategoryName, setInitCategoryName] = React.useState(null);
  const [errorForm, setErrorForm] = React.useState({
    name: "",
    description: "",
    category: "",
    quote: ""
  });
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "",
    price: "1",
    quote: "",
    note: ""
  });

  React.useEffect(() => {
    let id = param['id'];
    setLoading(true);
    axios.get(`/v1/product/${id}`).then((dist) => {
      console.log('res----------', dist?.data?.data);
      setFormData({
        name: dist?.data?.data?.name,
        description: dist?.data?.data?.description,
        category: dist?.data?.data?.category?.id,
        price: dist?.data?.data?.price,
        quote: dist?.data?.data?.quote,
        note: dist?.data?.data?.note
      });
      // setInitCategoryName(dist?.data?.data?.category?.name);
      setLoading(false);
    }).catch((err) => {
      swal("Oops!", "Get Product API Error", "error");
      setLoading(false);
    })

    let categoryParam = {
      size: "all"
    };

    axios.get("/v1/category", {params: categoryParam}).then((dist) => {
      const result = [];
      dist?.data?.data?.map((cat, index) => {
        result.push({
          name: cat.name,
          id: cat.id
        });
        if (index === dist.data.data.length - 1) {
          setCategoryList(result);
        }
      });
    }).catch((err) => {
      swal("Oops!", err.toString(), "error");
    });
  }, []);

  const validation = () => {
    const errorMsg = {
      name: "Product Name is required",
      description: "Product Description is required",
      category: "Category is required",
    };

    let preErrorForm = errorForm;
    let validate = true;
    Object.keys(errorMsg).map((dist) => {
      if (!formData[dist]) {
        console.log('formData', formData[dist]);
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });
    setErrorForm({ ...preErrorForm });
    return validate;
  }

  const updateProduct = (e) => {
    e.preventDefault();
    const validate = validation();
    console.log('validate', validate);
    if (validate) {
      let id = param['id'];
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("admin"));
      let formParam = new FormData();
      formParam.append('name', formData.name);
      formParam.append('description', formData.description);
      formParam.append('price', formData.price);
      formParam.append('categoryId', formData.category);
      formParam.append('quote', formData.quote);

      if (formData?.note) {
        formParam.append('note', formData.note);
      }

      formParam.append('created_user_id', user.id);
      axios.post(`/v1/product/update/${id}`, formParam,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((dist) => {
          console.log("Updated Product")
          setLoading(false);
          swal("Success", "Product is updated successfully", "success").then(() => {
            window.location.href = "/admin/product";
          });
        }).catch((err) => {
          swal("Oops!", "Update Product API Error", "error");
          setLoading(false);
        })
    }
  }

  const cancelClick = (e) => {
    e.preventDefault();
    window.location.href = "/admin/product";
  }

  /**
  * handle textbox change.
  */
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const preErrorForm = errorForm;
    let preFormData = formData;
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
                    <h4 class="card-title">Update Product</h4>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="name">Product Name</label>
                        <input type="text" name="name" className={errorForm?.name ? `form-control is-invalid` : `form-control`} value={formData.name} onChange={handleChange} id="name" placeholder="Product Name" />
                        {errorForm.name ? (
                          <div class="invalid-feedback">{errorForm.name}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="name">Description</label>
                        <textarea className={errorForm?.description ? `form-control is-invalid` : `form-control`} id="description" rows="3" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                        {errorForm.description ? (
                          <div class="invalid-feedback">{errorForm.description}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="fullDescription">Full Description</label>
                        <textarea className={errorForm?.fullDescription ? `form-control is-invalid` : `form-control`} id="fullDescription" rows="3" name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Full Description" />
                        {errorForm.fullDescription ? (
                          <div class="invalid-feedback">{errorForm.fullDescription}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="category">Category</label>
                        <select
                          // disabled={initCategoryName === "Home"}
                          className={errorForm?.category ? `custom-select is-invalid` : `custom-select`}
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}>
                          <option value="" selected>Choose...</option>
                          {categoryList.map((data) => {
                            return (
                              <>
                              {
                                <option value={data.id}>{data.name}</option>
                              }
                              </>
                            )
                          })
                          }
                        </select>
                        {errorForm.category ? (
                          <div class="invalid-feedback">{errorForm.category}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="price">Price</label>
                        <div class="input-group">
                            <span class="input-group-text">€</span>
                            <input type="number" name="price" className={errorForm?.price ? `form-control is-invalid` : `form-control`} value={formData.price} onChange={handleChange} id="price" placeholder="Enter the amount" />
                        </div>
                        {errorForm.price ? (
                          <div class="invalid-feedback">{errorForm.price}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="quote">Quote</label>
                        <input type="text" name="quote" className={errorForm?.quote ? `form-control is-invalid` : `form-control`} value={formData.quote} onChange={handleChange} id="quote"
                        placeholder="quis nostrud exerci tation ullamcorper suscipit lob- ortis nisl ut aliquip ex ea commodo consequat. Duis" />
                        {errorForm.quote ? (
                          <div class="invalid-feedback">{errorForm.quote}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="note">Notes</label>
                        <input type="text" name="note" className={`form-control`} value={formData.note} onChange={handleChange} id="material" placeholder="note" />
                      </div>

                      <button class="btn btn-primary mr-2" onClick={(e) => updateProduct(e)}>Update</button>
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

export default EditProductPage;