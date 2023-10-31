import React from 'react';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const EditCategoryPage = () => {
  const param = useParams();
  const [loading, setLoading] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState({
    name: '',
  });
  const [formData, setFormData] = React.useState({
    name: '',
  });

  React.useEffect(() => {
    let id = param['id'];
    setLoading(true);
    axios.get(`/v1/category/${id}`).then((dist) => {
      console.log('dist', dist);
      setFormData({
        name: dist?.data?.data?.name
      })
      setLoading(false);
    }).catch((err) => {
      alert('Get Category API Error' + err.toString());
      setLoading(false);
    })
  }, []);

  const validation = (value, name) => {
    if (name == "name") {
      if (!value) {
        return 'Category Name is required';
      }
      return '';
    }
  }

  const updateCategory = (e) => {
    e.preventDefault();
    const error = validation(formData['name'], 'name');
    let preErrorForm = errorForm;
    if (error !== preErrorForm['name']) {
      preErrorForm['name'] = error;
      setErrorForm({
        ...preErrorForm
      });
    }
    if (!error) {
      let id = param['id'];
      const user = JSON.parse(localStorage.getItem("admin"));
      const data = {
        name: formData.name,
        updated_user_id: user.id
      };
      axios.post(`/v1/category/update/${id}`, data).then((dist) => {
        swal("Success", "Category is updated successfully", "success").then(() => {
          window.location.href = "/admin/category";
        });
      }).catch((err) => {
        swal("Oops!", err.toString(), "error");
      })
    }
  }

  const cancelClick = (e) => {
    e.preventDefault();
    window.location.href = "/admin/category";
  }

  /**
  * handle textbox change.
  */
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let preFormData = formData;
    let preErrorForm = errorForm;
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
                    <h4 class="card-title">Create Category</h4>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="categoryName">Category Name</label>
                        <input type="text" name="name" class="form-control" value={formData.name} onChange={handleChange} id="categoryName" placeholder="category name" />
                        {errorForm.name ? (
                          <span className='text-danger mt-4'>{errorForm.name}</span>) : ''}
                      </div>
                      <button class="btn btn-primary mr-2" onClick={(e) => updateCategory(e)}>Update</button>
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

export default EditCategoryPage;