import React from 'react';
import swal from 'sweetalert';
import ReactAutocomplete from 'react-autocomplete';
import $ from 'jquery';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { MAX_COUNT } from '../../utils/constants/constant';
import axios from '../../axios/index';
import styles from './CreateMedia.module.scss';

const CreateMediaPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState({
    product: '',
    media: '',
    status: ''
  });
  const [formData, setFormData] = React.useState({
    product: '',
    media: '',
    status: 'available'
  });
  const [productList, setProductList] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [fileLimit, setFileLimit] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get("/v1/product").then((dist) => {
      const result = [];
      dist?.data?.data?.map((product, index) => {
        result.push({
          label: product.name,
          id: product.id
        });
        if (index === dist.data.data.length - 1) {
          setProductList(result);
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
      product: "Product Name is required",
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
      } else if (!formData[dist] || !selectedProductId) {
        preErrorForm[dist] = errorMsg[dist];
        validate = false;
      } else {
        preErrorForm[dist] = null;
      }
    });
    setErrorForm({...preErrorForm});
    return validate;
  }

  /**
   * add video.
   * @param {*} e 
   */
  const addMedia = (e) => {
    e.preventDefault();
    const validate = validation();
    if (validate) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("admin"));
      let formParam = new FormData();
      formParam.append('product', selectedProductId);

      for (const file of uploadedFiles) {
        formParam.append('media', file);
      }
      formParam.append('status', formData.status);

      axios.post("/v1/media", formParam,
      {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((dist) => {
          console.log("Created Media", dist);
          setLoading(false);
          swal("Success", "Media is created successfully", "success").then(() => {
          window.location.href = "/admin/media";
        });
      }).catch((err) => {
        swal("Oops!", err.toString(), "error");
        setLoading(false);
      })
    }
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
    setSelectedProductId(null);
    if (name === "product") {
      console.log('--------productList', productList, value);
      const temp = productList.filter((data) => data.label.indexOf(value) !== -1);
      console.log('---------temp', temp);
      setSuggestions(temp);
    }
    if (preFormData[name] && preErrorForm[name]) {
      preErrorForm[name] = null;
      setErrorForm({...preErrorForm});
    }
  };

  const handleSuggestionClick = (val) => {
    let preFormData = formData;
    preFormData['product'] = val.label;
    setSelectedProductId(val.id);
    setFormData({ ...preFormData });
    setSuggestions([]);
  }

  /**
   * handle file change.
   * @param {*} e 
   */
  const handleFileSelected = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  }

  /**
   * handle upload file.
   * @param {*} files 
   */
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
      return "custom-file-input is-invalid";
    } else {
      return "custom-file-input";
    }
  }

  /**
   * cancel click.
   * @param {*} e 
   */
  const cancelClick = (e) => {
    e.preventDefault();
    window.location.href = "/admin/video";
  }

  return (
    <div class="container-scroller">
      <Header />
      {loading && <LoadingSpinner />}
      {/* <!-- partial --> */}
      <div class="page-body-wrapper">
        {/* <!-- partial:partials/_sidebar.html --> */}
        <Sidebar />
        {/* <!-- partial --> */}
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="row">
              <div class="col-md-12 stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Create Media</h4>
                    <form class="forms-sample">

                    <div class="form-group">
                        <label for="name">Product Name</label>

                        <input class="form-control" id="product" name='product' type="text"
                        placeholder="Search..."
                        value={formData.product}
                        onChange={handleChange} />
                        <div className={styles.autoSuggest}>
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className={styles.autoSuggestItem} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.label}
                          </div>
                        ))}
                      </div>
                        {errorForm.name ? (
                          <span className='text-danger mt-4'>{errorForm.name}</span>) : ''}
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

                      <button class="btn btn-primary mr-2" onClick={(e) => addMedia(e)}>Add</button>
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

export default CreateMediaPage;