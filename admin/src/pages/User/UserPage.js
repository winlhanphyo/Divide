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

const UserPage = () => {
  let query = useQuery();
  const user = JSON.parse(localStorage.getItem("admin"));
  const [loading, setLoading] = React.useState(false);
  const [userList, setUserList] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [paginationData, setPaginationData] = React.useState({
    from: 1,
    last_page: 1,
    per_page: 1
  })
  const [totalCount, setTotalCount] = React.useState(0);
  const [paginateCount, setPaginateCount] = React.useState([]);
  const [deleteId, setDeleteId] = React.useState(null);
  const searchName = React.createRef();

  React.useEffect(() => {
    getUserList()
  }, []);

  const getUserList = (offsetData = 1) => {
    offsetData = Number(query.get("page")) || 1;
    let searchNameData = query.get("searchName") || searchName.current.value;
    searchName.current.value = searchNameData;
    let params = {
      size: 5,
      page: Number(offsetData)
    };
    if (searchNameData) {
      params.name = searchNameData;
    }
    setLoading(true);
    axios.get("/v1/user", {
      params
    }).then((dist) => {
      // $(".odd").empty();
      setUserList(dist?.data?.data);
      setOffset(dist?.data?.offset);
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
      setLoading(false);
    }).catch((err) => {
      swal("Oops!", "Get User API Error", "error");
      setLoading(false);
    });
  }

  const goToCreateUser = () => {
    window.location.href="/admin/user/create";
  };

  const editUser = (id) => {
    window.location.href=`/admin/user/${id}/edit`;
  }

  const deleteUser = () => {
    setLoading(true);
    axios.delete(`/user/${deleteId}`).then((dist) => {
      getUserList();
    }).catch((err) => {
      swal("Oops!", "Delete User API Error", "error");
      setLoading(false);
    });
  }

  const showDeleteDialog = (id) => {
    console.log('show delete id', id);
    setDeleteId(id);
  }

  const searchUser = () => {
    let offsetData = Number(query.get("page")) || 1;
    let searchNameData = searchName.current.value;
    window.location.href = "/admin/user?page=" + offsetData + "&searchName=" + searchNameData;
  }

  return (
    <>
      <div class="container-scroller">
        <Header />
        {loading && <LoadingSpinner />}
        {/* <!-- partial --> */}
        <div class="container-fluid page-body-wrapper">
          {/* <!-- partial:partials/_sidebar.html --> */}
          <Sidebar />
          {/* <!-- partial --> */}
          <div class="main-panel">
            <div class="content-wrapper">
              <div class="row">
                <div class="col-md-12 stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <p class="card-title">User</p>
                      <div className="btn-div">
                        <div className="search-group">
                            <div class="form-row align-items-center">
                              <div class="col-auto">
                                <label class="sr-only" for="inlineFormInput">Name</label>
                                <input type="text" class="form-control mb-2" id="searchName" ref={searchName} placeholder="Search Name" />
                              </div>
    
                              <div class="col-auto">
                              <button class="btn btn-primary mb-2" onClick={searchUser}>Search</button>
                            </div>
                            </div>
                        </div>

                        <div className="addbtn-div">
                          <button type="button" class="addBtn btn btn-primary" onClick={goToCreateUser}>Add</button>
                        </div>
                      </div>
                      <div class="table-responsive">
                        <table id="recent-purchases-listing" class="table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email</th>
                              <th>Type</th>
                              <th>Created At</th>
                              <th>Updated At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userList.map((data, index) => {
                              return (
                                <tr>
                                  <td>{((index + 1) + Number(offset))}</td>
                                  <td>{data.firstName}</td>
                                  <td>{data.lastName}</td>
                                  <td>{data.email}</td>
                                  <td>{data.type}</td>
                                  <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
                                  <td>{moment(data.updatedAt).format('YYYY-MM-DD')}</td>
                                  <td>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook" onClick={() => editUser(data.id)}><i class="mdi mdi-pencil"></i></button>
                                    <button
                                      type="button"
                                      class="btn btn-social-icon btn-outline-facebook"
                                      data-toggle="modal"
                                      data-target="#confirmModal"
                                      disabled={data?.id.toString() === user?.id?.toString()}
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
                          paginateUrl="/admin/user?page="
                          metadata={paginationData}
                          fetchData={getUserList} />
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
      <ConfirmDialog text="Are you sure want to delete" next={deleteUser} btnLabel="Delete" />
    </>
  )
}

export default UserPage;