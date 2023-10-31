import React from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import 'bootstrap';
import { useLocation } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import StockDialog from "../../components/StockDialog/StockDialog";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';
import OscarPagination from '../../components/OscarPagination/OscarPagination';



function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const ProductPage = () => {
  let query = useQuery();
  const [loading, setLoading] = React.useState(false);
  const [productList, setProductList] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [paginationData, setPaginationData] = React.useState({
    from: 1,
    last_page: 1,
    per_page: 1
  })
  const [totalCount, setTotalCount] = React.useState(0);
  const [paginateCount, setPaginateCount] = React.useState([]);
  const [deleteId, setDeleteId] = React.useState(null);
  const [stockData, setStockData] = React.useState(null);
  const searchName = React.createRef();

  React.useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async (offsetData = 1) => {
    offsetData = Number(query.get("page")) || 1;
    let searchNameData = query.get("searchName") || searchName?.current?.value;
    if (searchName?.current?.value) {
      searchName.current.value = searchNameData;
    }
    let params = {
      size: 5,
      page: Number(offsetData)
    };
    if (searchNameData) {
      params.name = searchNameData
    }
    setLoading(true);
    // const category = await axios.get("/v1/product/category/2");
    // console.log('-----------category--------', category);
    axios.get("/v1/product", {
      params
    }).then((dist) => {
      // $(".odd").empty();
      setProductList(dist?.data?.data);
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
      setLoading(false);
      console.log('page', lastPage);
      let prePaginationData = {
        from: dist?.data?.offset,
        last_page: lastPage,
        per_page: 5
      }
      setPaginationData({...prePaginationData});
      console.log('prePaginationData', prePaginationData);
    }).catch((err) => {
      swal("Oops!", "Product List Page API Error", "error");
      setLoading(false);
    });
  }

  const goToCreateProduct = () => {
    window.location.href = "/admin/product/create";
  };

  const editProduct = (id) => {
    window.location.href = `/admin/product/${id}/edit`;
  }

  const deleteCategory = () => {
    setLoading(true);
    axios.delete(`/v1/product/${deleteId}`).then((dist) => {
      getProductList();
    }).catch((err) => {
      swal("Oops!", err.toString(), "error");
      setLoading(false);
    });
  }

  const showDeleteDialog = (id) => {
    setDeleteId(id);
  }

  const showStockDialog = (data) => {
    setStockData(data);
  }

  const searchProduct = () => {
    let offsetData = Number(query.get("page")) || 1;
    let searchNameData = searchName.current.value;
    window.location.href = "/admin/product?page=" + offsetData + "&searchName=" + searchNameData;
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
                      <p class="card-title">Product</p>

                      <div className="btn-div">
                        <div className="search-group">
                          <div class="form-row align-items-center">
                            <div class="col-auto">
                              <label class="sr-only" for="inlineFormInput">Name</label>
                              <input type="text" class="form-control mb-2" id="searchText" ref={searchName} placeholder="Search Name" />
                            </div>

                            <div class="col-auto">
                              <button class="btn btn-primary mb-2" onClick={searchProduct}>Search</button>
                            </div>
                          </div>
                        </div>

                        <div className="addbtn-div">
                          <button type="button" class="addBtn btn btn-primary" onClick={goToCreateProduct}>Add</button>
                        </div>
                      </div>

                      <div class="table-responsive">
                        <table id="recent-purchases-listing" class="table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th>Created At</th>
                              <th>Updated At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productList.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td>{((index + 1) + Number(offset))}</td>
                                  <td style={{width: "20%"}}>{data?.name}</td>
                                  <td>{data?.category?.name}</td>
                                  <td>€{data?.price}</td>
                                  <td>{data?.status}</td>
                                  <td>{moment(data.createdAt).format('YYYY-MM-DD')}</td>
                                  <td>{moment(data.updatedAt).format('YYYY-MM-DD')}</td>
                                  <td>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook" onClick={() => editProduct(data.id)}><i class="mdi mdi-pencil"></i></button>
                                    <button
                                      type="button"
                                      class="btn btn-social-icon btn-outline-facebook"
                                      data-toggle="modal" data-target="#confirmModal"
                                      onClick={() => showDeleteDialog(data.id)}><i class="mdi mdi-delete"></i></button>
                                    <button type="button" class="btn btn-social-icon btn-outline-facebook"
                                      data-toggle="modal"
                                      data-target="#stockModal"
                                      onClick={() => showStockDialog(data)}>
                                        <i class="mdi mdi-plus"></i>
                                    </button>
                                  </td>
                                </tr>
                              )
                            })
                            }
                          </tbody>
                        </table>

                        <OscarPagination
                          paginateUrl="/admin/product?page="
                          metadata={paginationData}
                          fetchData={getProductList}
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
      <StockDialog productData={stockData}/>
    </>
  )
}

export default ProductPage;