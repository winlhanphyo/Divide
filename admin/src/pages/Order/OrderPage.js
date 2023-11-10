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

const OrderPage = () => {
  let query = useQuery();
  const [loading, setLoading] = React.useState(false);
  const [orderList, setOrderList] = React.useState([]);
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
    getOrderList();
  }, []);

  const getOrderList = async (offsetData = 0) => {
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

    axios.get("/v1/order", {
      params
    }).then((dist) => {
      // $(".odd").empty();
      setOrderList(dist?.data?.data);
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
      swal("Oops!", err.toString(), "error");
      setLoading(false);
    });
  }

  // const paginateClick = (status = null, index = 0) => {
  //   if (status === "next") {
  //     getOrderList(offset + 1);
  //   } else if (status === "prev") {
  //     getOrderList(offset - 1);
  //   } else {
  //     getOrderList(index - 1);
  //   }
  // };

  const searchOrder = () => {
    let offsetData = Number(query.get("page")) || 0;
    let searchNameData = searchName.current.value;
    window.location.href = "/admin/order?page=" + offsetData + "&searchName=" + searchNameData;
  }

  const editOrder = (id) => {
    window.location.href = `/admin/order/${id}/edit`;
  }

  const goToOrderDetail = (id) => {
    window.location.href = `/admin/order/${id}`;
  }

  const deleteOrder = () => {
    console.log('delete order', deleteId);
    axios.delete(`/order/${deleteId}`).then((dist) => {
      getOrderList();
    }).catch((err) => {
      swal("Oops!", "Delete Order API Error", "error");
    });
  }

  const showDeleteDialog = (id) => {
    console.log('show delete id', id);
    setDeleteId(id);
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
                      <p class="card-title">Order</p>

                      <div className="btn-div">
                        <div className="search-group">
                          <div class="form-row align-items-center">
                            <div class="col-auto">
                              <label class="sr-only" for="inlineFormInput">Name</label>
                              <input type="text" class="form-control mb-2" id="searchText" ref={searchName} placeholder="Search Name" />
                            </div>

                            <div class="col-auto">
                              <button class="btn btn-primary mb-2" onClick={searchOrder}>Search</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="table-responsive">
                        <table id="recent-purchases-listing" class="table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Customer Name</th>
                              <th>Address</th>
                              <th>City</th>
                              <th>Phone</th>
                              <th>Status</th>
                              <th>Payment</th>
                              <th>Created At</th>
                              <th>Updated At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderList.map((data, index) => {
                              return (
                                <tr>
                                  <td>{((index + 1) + Number(offset))}</td>
                                  <td>{`${data?.firstName} ${data?.lastName}`}</td>
                                  <td>{data?.address}</td>
                                  <td>{data?.city}</td>
                                  <td>{data?.phone}</td>
                                  <td>{data?.status}</td>
                                  <td>{data?.paymentDone === true ? 'done' : 'not paid'}</td>
                                  <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
                                  <td>{moment(data.updatedAt).format('YYYY-MM-DD')}</td>
                                  <td>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook" onClick={() => goToOrderDetail(data.id)}><i class="mdi mdi-information"></i></button>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook" onClick={() => editOrder(data.id)}><i class="mdi mdi-pencil"></i></button>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook" data-toggle="modal" data-target="#confirmModal" onClick={() => showDeleteDialog(data.id)}><i class="mdi mdi-delete"></i></button>
                                  </td>
                                </tr>
                              )
                            })
                            }
                          </tbody>
                        </table>

                        <OscarPagination
                          paginateUrl="/admin/order?page="
                          metadata={paginationData}
                          fetchData={getOrderList} />

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
      <ConfirmDialog text="Are you sure want to delete" next={deleteOrder} btnLabel="Delete" />
    </>
  )
}

export default OrderPage;