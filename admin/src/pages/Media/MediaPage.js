import React from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import { useLocation } from 'react-router-dom';
import $ from 'jquery';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OscarPagination from '../../components/OscarPagination/OscarPagination';
import { ImageModal } from '../../components/ImageModal/ImageModal';
import axios from '../../axios/index';
import { imageURL } from '../../utils/constants/constant';
import styles from './MediaPage.module.scss';


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const MediaPage = () => {
  let query = useQuery();
  const [loading, setLoading] = React.useState(false);
  const [mediaList, setMediaList] = React.useState([]);
  const [paginationData, setPaginationData] = React.useState({
    from: 1,
    last_page: 1,
    per_page: 1
  })
  const [offset, setOffset] = React.useState(0);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [imageModalSrc, setImageModalSrc] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const searchName = React.createRef();
  const [showModal, setShowModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState(null);

  React.useEffect(() => {
    getMediaList();
  }, []);

  const getMediaList = (offsetData = 1) => {
    offsetData = Number(query.get("page")) || 1;
    let searchNameData = query.get("searchName") || searchName?.current?.value;
    if (searchName?.current?.value) {
      searchName.current.value = searchNameData;
    }
    let params = {
      size: 5,
      page: offsetData
    };
    if (searchNameData) {
      params.name = searchNameData
    }
    setLoading(true);
    axios.get("/v1/media", {
      params
    }).then((dist) => {
      setLoading(false);
      console.log('data', dist?.data?.data);
      setMediaList([...dist?.data?.data]);
      setOffset(dist?.data?.offset);
      const page = dist?.data?.count / 5;
      const count = [];
      let lastPage = 0;
      for (let i = 0; i < page; i++) {
        count.push(i + 1);
        lastPage = i + 1;
      }
      let prePaginationData = {
        from: dist?.data?.offset,
        last_page: lastPage,
        per_page: 5
      }
      setPaginationData({ ...prePaginationData });
    }).catch((err) => {
      setLoading(false);
      console.log('Get Media API error', err);
      swal("Oops!", "Get Media API error", "error");
    });
  }

  const goToCreateMedia = () => {
    window.location.href = "/admin/media/create";
  };

  const editMedia = (id) => {
    window.location.href = `/admin/media/${id}/edit`;
  }

  /**
   * deleteMedia
   */
  const deleteMedia = () => {
    axios.delete(`/v1/media/${deleteId}`).then((dist) => {
      getMediaList();
    }).catch((err) => {
      console.log('Delete Media API error', err);
      swal("Oops!", "Delete Media API Error", "error");
    });
  }

  /**
   * show delete confirm dialog.
   * @param {*} id 
   */
  const showDeleteDialog = (id) => {
    setDeleteId(id);
  }

  /**
   * search media.
   */
  const searchMedia = () => {
    let offsetData = Number(query.get("page")) || 1;
    let searchNameData = searchName.current.value;
    window.location.href = "/admin/media?page=" + offsetData + "&searchName=" + searchNameData;
  }

  const showImageModal = (src) => {
    setImageModalOpen((prev) => !prev);
    setImageModalSrc(src);
  }

  /**
   * handle media status toggle change.
   * @param {*} e 
   * @param {*} id 
   */
  const handleToggleChange = (e, id) => {
    const value = e.target.checked;
    setLoading(true);
    // const user = JSON.parse(localStorage.getItem("admin"));
    const status = value ? "available" : "not available";
    let formParam = new FormData();
    formParam.append('status', status);
    axios.post(`/v1/media/${id}`, formParam,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((dist) => {
        console.log("Updated Media Status")
        setLoading(false);
        swal("Success", "Media Status is updated successfully", "success").then(() => {
          getMediaList();
        });
      }).catch((err) => {
        swal("Oops!", "Update Media API Error", "error");
        setLoading(false);
      })
  }

  /**
   * handle Edit Media.
   * @param {*} media 
   */
  const handleEdit = (media) => {
    setShowModal(true);
    setEditMediaData(media);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
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
                      <p class="card-title">Media</p>

                      <div className="btn-div">
                        <div className="search-group">
                          <div class="form-row align-items-center">
                            <div class="col-auto">
                              <label class="sr-only" for="inlineFormInput">Media Name</label>
                              <input type="text" class="form-control mb-2" id="searchText" ref={searchName} placeholder="Media Name" />
                            </div>

                            <div class="col-auto">
                              <button class="btn btn-primary mb-2" onClick={searchMedia}>Search</button>
                            </div>
                          </div>
                        </div>

                        <div className="addbtn-div">
                          <button type="button" class="addBtn btn btn-primary" onClick={goToCreateMedia}>Add</button>
                        </div>
                      </div>

                      <div class="table-responsive">
                        <table id="category-listing" class="table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Name</th>
                              <th>Product</th>
                              <th>Type</th>
                              <th>URL</th>
                              <th>Status</th>
                              <th>Created At</th>
                              <th>Updated At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mediaList.map((data, index) => {
                              return (
                                <tr>
                                  <td>{((index + 1) + Number(offset))}</td>
                                  <td>{data?.name} &nbsp;&nbsp;<i className={`mdi mdi-pencil ${styles.mediaEdit}`} onClick={() => handleEdit(data)}></i></td>
                                  <td>{data?.products?.length > 0 && data?.products[0]?.name}</td>
                                  <td>{data?.type}</td>
                                  <td><img onClick={() => showImageModal(imageURL + data.cover)} src={imageURL + data.cover} /></td>
                                  <td>
                                    <>
                                      <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" checked={data?.status === "available" ? true : false} onChange={(e) => handleToggleChange(e, data.id)} />
                                      </div>
                                    </>
                                  </td>
                                  <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
                                  <td>{moment(data.updatedAt).format('YYYY-MM-DD')}</td>
                                  <td>
                                    <button
                                      type="button"
                                      class="btn btn-social-icon btn-outline-facebook"
                                      data-toggle="modal"
                                      data-target="#confirmModal"
                                      disabled={mediaList?.length === 1}
                                      onClick={() => showDeleteDialog(data.id)}>
                                      <i class="mdi mdi-delete"></i>
                                    </button>
                                  </td>
                                </tr>
                              )
                            })
                            }
                          </tbody>
                        </table>

                        <OscarPagination
                          paginateUrl="/admin/media?page="
                          metadata={paginationData}
                          fetchData={getMediaList}
                        />
                      </div>
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
        </div>
      </div>
      <ConfirmDialog text="Are you sure want to delete" next={deleteMedia} btnLabel="Delete" />
      {imageModalOpen && (
        <ImageModal onClose={() => setImageModalOpen(false)}>
          <img style={{ width: "38vw" }} src={imageModalSrc} alt="" />
        </ImageModal>
      )}
      <EditMedia
        media={editMediaData}
        showModal={showModal}
        closeModal={closeModal}
        getMediaList={getMediaList}
        setLoading={setLoading}
      />
    </>
  )
};

const EditMedia = ({ media, showModal, closeModal, setLoading, getMediaList }) => {
  const [errorForm, setErrorForm] = React.useState({
    name: ""
  });
  const [name, setName] = React.useState(null);

  React.useEffect(() => {
    setName(media?.name);
  }, [media?.name]);

  /**
   * validation.
   * @returns 
   */
  const validation = () => {
    let preErrorForm = errorForm;
    let validate = true;
    if (!name) {
      preErrorForm.name = "Media Name is required";
      validate = false;
    } else {
      preErrorForm.name = null;
    }
    setErrorForm({ ...preErrorForm });
    return validate;
  }

  /**
  * handle textbox change media.
  */
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let preErrorForm = errorForm;
    setName(value);
    if (value && preErrorForm[name]) {
      preErrorForm[name] = null;
      setErrorForm({ ...preErrorForm });
    }
  };

  /**
   * save media name.
   * @param {*} e 
   */
  const handleSave = (e) => {
    e.preventDefault();
    const validate = validation();
    if (validate) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("admin"));
      let formParam = new FormData();
      formParam.append('name', name);

      axios.post(`/v1/media/${media?.id}`, formParam,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((dist) => {
          console.log("Updated Media Name", dist);
          setLoading(false);
          swal("Success", "Media is updated successfully", "success").then(() => {
            getMediaList();
            closeModal();
          });
        }).catch((err) => {
          swal("Oops!", err.toString(), "error");
          setLoading(false);
        })
    }
  }

  return (
    <div className={`modal fade${showModal ? ' show' : ''}`} tabindex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
            <button type="button" class="close" onClick={closeModal} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="forms-sample">
              <div class="form-group">
                <label for="mediaName">Edit Media</label>
                <input type="text" name="name" class="form-control" value={name} onChange={handleChange} id="mediaName" placeholder="media name" />
                {errorForm.name ? (
                  <span className='text-danger mt-4'>{errorForm.name}</span>) : ''}
              </div>
              {/* <button class="btn btn-primary mr-2" onClick={(e) => addCategory(e)}>Add</button>
                      <button class="btn btn-light" onClick={(e) => cancelClick(e)}>Cancel</button> */}
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onClick={closeModal}>Close</button>
            <button type="button" class="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaPage;