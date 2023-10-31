import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import swal from 'sweetalert';
import { useLocation } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OscarPagination from '../../components/OscarPagination/OscarPagination';
import axios from '../../axios/index';


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const CategoryPage = () => {
  let query = useQuery();
  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const [paginationData, setPaginationData] = React.useState({
    from: 1,
    last_page: 1,
    per_page: 1
  })
  const [offset, setOffset] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [paginateCount, setPaginateCount] = React.useState([]);
  const [deleteId, setDeleteId] = React.useState(null);
  const searchName = React.createRef();

  React.useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = (offsetData = 1) => {
    offsetData = Number(query.get("page")) || 1;
    let searchNameData = query.get("searchName") || searchName.current.value;
    searchName.current.value = searchNameData;
    let params = {
      size: 5,
      page: offsetData
    };
    if (searchNameData) {
      params.name = searchNameData
    }
    setLoading(true);
    axios.get("/v1/category", {
      params
    }).then((dist) => {
      setLoading(false);
      setCategoryList(dist?.data?.data);
      setOffset(dist?.data?.offset);
      console.log('--------offset------', dist?.data?.offset)
      setTotalCount(dist?.data?.count);
      const page = dist?.data?.count / 5;
      const count = [];
      let lastPage = 0;
      for (let i = 0; i < page; i++) {
        count.push(i + 1);
        lastPage = i + 1;
      }
      setPaginateCount(count);
      let prePaginationData = {
        from: dist?.data?.offset,
        last_page: lastPage,
        per_page: 5
      }
      setPaginationData({...prePaginationData});
    }).catch((err) => {
      setLoading(false);
      console.log('Get Category API error', err);
      swal("Oops!", "Get Category API error", "error");
    });
  }

  // const paginateClick = (status = null, index = 0) => {
  //   if (status === "next") {
  //     getCategoryList(offset + 1);
  //   } else if (status === "prev") {
  //     getCategoryList(offset - 1);
  //   } else {
  //     getCategoryList(index - 1);
  //   }
  // };

  const goToCreateCategory = () => {
    window.location.href = "/admin/category/create";
  };

  const editCategory = (id) => {
    window.location.href = `/admin/category/${id}/edit`;
  }

  const deleteCategory = () => {
    axios.delete(`/category/${deleteId}`).then((dist) => {
      getCategoryList();
    }).catch((err) => {
      console.log('Delete Category API error', err);
      swal("Oops!", "Delete Category API Error", "error");
    });
  }

  const showDeleteDialog = (id) => {
    setDeleteId(id);
  }

  const searchCategory = () => {
    let offsetData = Number(query.get("page")) || 1;
    let searchNameData = searchName.current.value;
    window.location.href = "/admin/category?page=" + offsetData + "&searchName=" + searchNameData;
  }

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
                      <p class="card-title">Category</p>

                      <div className="btn-div">
                        <div className="search-group">
                          <div class="form-row align-items-center">
                            <div class="col-auto">
                              <label class="sr-only" for="inlineFormInput">Name</label>
                              <input type="text" class="form-control mb-2" id="searchText" ref={searchName} placeholder="Search Name" />
                            </div>

                            <div class="col-auto">
                              <button class="btn btn-primary mb-2" onClick={searchCategory}>Search</button>
                            </div>
                          </div>
                        </div>

                        <div className="addbtn-div">
                          <button type="button" class="addBtn btn btn-primary" onClick={goToCreateCategory}>Add</button>
                        </div>
                      </div>

                      <div class="table-responsive">
                        <table id="category-listing" class="table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Name</th>
                              <th>Created At</th>
                              <th>Updated At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryList.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td>{((index + 1) + Number(offset))}</td>
                                  <td>{data.name}</td>
                                  <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
                                  <td>{moment(data.updatedAt).format('YYYY-MM-DD')}</td>
                                  <td>
                                    <button
                                      type="button"
                                      class="btn btn-social-icon btn-outline-facebook"
                                      disabled={categoryList?.length === 1}
                                      onClick={() => editCategory(data.id)}>
                                        <i class="mdi mdi-pencil"></i>
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-social-icon btn-outline-facebook"
                                      data-toggle="modal"
                                      data-target="#confirmModal"
                                      disabled={categoryList?.length === 1}
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

                        {/* <nav aria-label="Category Page navigation">
                          <ul class="pagination justify-content-center">
                            <li className={Number(offset) === 0 ? "page-item disabled" : "page-item"}>
                              <a class="page-link" href="#" tabindex={offset - 1} onClick={() => paginateClick("prev")}>Previous</a>
                            </li>
                            {paginateCount?.map((dist) => {
                              return (
                                <>
                                  <li className={Number(dist - 1) === Number(offset) ? "page-item active" : "page-item"}><a class="page-link"
                                    onClick={() => paginateClick(null, dist)}>{dist}</a></li>
                                </>
                              )
                            })}
                            <li class="page-item">
                              <a className={totalCount <= ((Number(offset) + 1) * 5) ? "page-link disabled" : "page-link"} onClick={() => paginateClick("next")}>Next</a>
                            </li>
                          </ul>
                        </nav> */}

                        <OscarPagination
                          paginateUrl="/admin/category?page="
                          metadata={paginationData}
                          fetchData={getCategoryList}
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
          {/* <!-- main-panel ends --> */}
        </div>
        {/* <!-- page-body-wrapper ends --> */}
      </div>
      <ConfirmDialog text="Are you sure want to delete" next={deleteCategory} btnLabel="Delete" />
    </>
  )
}

export default CategoryPage;