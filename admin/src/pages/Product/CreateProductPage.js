import React from 'react';
import swal from 'sweetalert';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import axios from '../../axios/index';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { MAX_COUNT } from '../../utils/constants/constant';
import styles from './Product.module.scss';

const CreateProductPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const [errorForm, setErrorForm] = React.useState({
    name: "",
    description: "",
    category: "",
    quote: "",
    media: null
  });
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "",
    price: "1",
    quote: "",
    note: "",
    // media: null,
    status: "available"
  });
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [fileLimit, setFileLimit] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get("/v1/category").then((dist) => {
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
      setLoading(false);
    }).catch((err) => {
      swal("Oops!", err.toString(), "error");
      setLoading(false);
    });
  }, []);

  const validation = () => {
    const errorMsg = {
      name: "Product Name is required",
      category: "Category is required",
      quote: "Quote is required",
      description: "Description is required",
      media: "Media is required"
    };

    let preErrorForm = errorForm;
    let validate =  true;
    Object.keys(errorMsg).map((dist) => {
      if (dist === "media") {
        if (uploadedFiles.length <= 0) {
          preErrorForm[dist] = errorMsg[dist];
          validate = false;
        } else {
          preErrorForm[dist] = null;
        }
      } else if (!formData[dist]) {
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });
    setErrorForm({...preErrorForm});
    return validate;
  }

  const addProduct = (e) => {
    e.preventDefault();
    const validate = validation();
    if (validate) {
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
      formParam.append('status', formData.status);

      for (const file of uploadedFiles) {
        formParam.append('media', file);
      }

      axios.post("/v1/product", formParam,
      {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((dist) => {
          console.log("Created Product", dist);
          setLoading(false);
          swal("Success", "Product is created successfully", "success").then(() => {
          window.location.href = "/admin/product";
        });
      }).catch((err) => {
        swal("Oops!", err.toString(), "error");
        setLoading(false);
      })
    }
  }

  const cancelClick = (e) => {
    e.preventDefault();
    window.location.href="/admin/product";
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
      setErrorForm({...preErrorForm});
    }
  };

  /**
   * handle file change.
   * @param {*} e 
   */
  const handleFileSelected = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  }

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    })
    if (!limitExceeded) setUploadedFiles(uploaded);
  }

  const getDisabledFile = () => {
    if (fileLimit) {
      console.log('file limit exceeded');
      return "disabled custom-file-input";
    } else if (errorForm?.media) {
      console.log('--------media------------');
      return "custom-file-input is-invalid";
    } else {
      console.log('-----------custom file input----------');
      return "custom-file-input";
    }
  }

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
                    <h4 class="card-title">Create Product</h4>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="name">Product Name</label>
                        <input type="text" name="name" className={errorForm?.name ? `form-control is-invalid` : `form-control`} value={formData.name} onChange={handleChange} id="name" placeholder="product name"/>
                        {errorForm.name ? (
                          <div class="invalid-feedback">{errorForm.name}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="description">Description</label>
                        <textarea className={errorForm?.description ? `form-control is-invalid` : `form-control`} id="description" rows="3" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                        {errorForm.description ? (
                          <div class="invalid-feedback">{errorForm.description}</div>) : ''}
                      </div>

                      <div class="form-group">
                        <label for="category">Category</label>
                        <select className={errorForm?.category ? `custom-select is-invalid` : `custom-select`} id="category" name="category" value={formData.category} onChange={handleChange}>
                          <option value="" selected>Choose...</option>
                          {categoryList.map((data) => {
                            return (
                              <>
                              {
                                <option value={data.id}>{data.name}</option>
                              }
                              </>
                            )})}
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

                      <div class="form-group">
                        <label for="status">Status</label>
                        <select className={errorForm?.status ? `custom-select is-invalid` : `custom-select`} id="status" name="status" value={formData.status} onChange={handleChange}>
                          <option value="available" selected>Available</option>
                          <option value="not available">Not Available</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label for="media">Media</label>
                        <div class="custom-file">
                          <input type="file" multiple name="media" className={getDisabledFile()} id="media" onChange={handleFileSelected} required />
                          <label class="custom-file-label" for="validatedCustomFile">{"Choose file..."}</label>
                          {errorForm.media ? (
                            <div class="invalid-feedback">{errorForm.media}</div>) : ''}
                        </div>
                        <div className="uploaded-files-list">
                          {uploadedFiles.map(file => (
                            <div>
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button class="btn btn-primary mr-2" onClick={(e) => addProduct(e)}>Add</button>
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

export default CreateProductPage;