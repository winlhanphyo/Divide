import React from 'react';
import swal from 'sweetalert';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import BarChart from "../../components/BarChart/BarChart";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from '../../axios/index';

const HomePage = () => {
  Chart.register(CategoryScale);
  const [loading, setLoading] = React.useState(false);
  const [saleChartData, setSaleChartData] = React.useState({
    labels: [], 
    datasets: [
      {
        label: "Total Sale",
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  });

  const [productChartData, setProductChartData] = React.useState({
    labels: [], 
    datasets: [
      {
        label: "Top Products",
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  });

  const [dashboardData, setDashboardData] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    // setChartData();
    axios.get("/v1/dashboard").then((dist) => {
      setLoading(false);
      console.log('dashboard data');
      console.log(dist?.data?.data);
      setDashboardData(dist?.data?.data);
      setUpChartData(dist?.data?.data);
    }).catch((err) => {
      // swal("Oops!", err.toString(), "error");
      setLoading(false);
    });
  }, []);

  const setUpChartData = (data) => {
    const productName = data.graph.product.map((dist) => dist.mediaData.name);
    const amount = data.graph.product.map((dist) => dist.totalAmountSold);
    let preProductChartData = productChartData;
    preProductChartData.labels = productName;
    const productDataSet = [{
      data: [...amount]
    }];
    preProductChartData.datasets = [...productDataSet];
    setProductChartData({...preProductChartData});

    let preSaleChartData = saleChartData;
    preSaleChartData.labels = data.graph.sales.labels;
    const saleDataSet = [{
      data: [...data.graph.sales.saleAmount]
    }];
    preSaleChartData.datasets = [...saleDataSet];
    console.log('preSaleChartData', preSaleChartData);
    setSaleChartData({...preSaleChartData});
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
                <div class="col-md-12 grid-margin">
                  <div class="d-flex justify-content-between flex-wrap">
                    <div class="d-flex align-items-end flex-wrap">
                      <div class="mr-md-3 mr-xl-5">
                        <h2>Dashboard</h2>
                        <p class="mb-md-0">Your analytics dashboard template.</p>
                      </div>
                      <div class="d-flex">
                        <i class="mdi mdi-home text-muted hover-cursor"></i>
                        <p class="text-muted mb-0 hover-cursor">&nbsp;/&nbsp;Dashboard&nbsp;/&nbsp;</p>
                        <p class="text-primary mb-0 hover-cursor">Analytics</p>
                      </div>
                    </div>
                    {/* <div class="d-flex justify-content-between align-items-end flex-wrap">
                      <button type="button" class="btn btn-light bg-white btn-icon mr-3 d-none d-md-block ">
                        <i class="mdi mdi-download text-muted"></i>
                      </button>
                      <button type="button" class="btn btn-light bg-white btn-icon mr-3 mt-2 mt-xl-0">
                        <i class="mdi mdi-clock-outline text-muted"></i>
                      </button>
                      <button type="button" class="btn btn-light bg-white btn-icon mr-3 mt-2 mt-xl-0">
                        <i class="mdi mdi-plus text-muted"></i>
                      </button>
                      <button class="btn btn-primary mt-2 mt-xl-0">Download report</button>
                    </div> */}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body dashboard-tabs p-0">
                      <ul class="nav nav-tabs px-4" role="tablist">
                        <li class="nav-item">
                          <a class="nav-link active" id="overview-tab" data-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">Overview</a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" id="sales-tab" data-toggle="tab" href="#sales" role="tab" aria-controls="sales" aria-selected="false">Sales List</a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" id="purchases-tab" data-toggle="tab" href="#purchases" role="tab" aria-controls="purchases" aria-selected="false">Order List</a>
                        </li>
                      </ul>
                      <div class="tab-content py-0 px-0">
                      <div class="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
                      <div class="d-flex flex-wrap justify-content-xl-between">
                        <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="mdi mdi-buffer mr-3 icon-lg text-danger"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Products</small>
                            <h5 class="mr-2 mb-0">{dashboardData?.overview?.productCount}</h5>
                          </div>
                        </div>
                        <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="mdi mdi-collage mr-3 icon-lg text-success"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Category</small>
                            <h5 class="mr-2 mb-0">{dashboardData?.overview?.categoryCount}</h5>
                          </div>
                        </div>
                        <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="mdi mdi-account-network mr-3 icon-lg text-warning"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Users</small>
                            <h5 class="mr-2 mb-0">{dashboardData?.overview?.userCount}</h5>
                          </div>
                        </div>
                        <div class="d-flex py-3 border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Total Sales</small>
                            <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.totalSaleAmount}</h5>
                          </div>
                        </div>
                        <div class="d-flex py-3 border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="mdi mdi-view-list mr-3 icon-lg text-primary"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Total Order</small>
                            <h5 class="mr-2 mb-0">{dashboardData?.order?.totalCount}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                        <div class="tab-pane fade" id="sales" role="tabpanel" aria-labelledby="sales-tab">
                          <div class="d-flex flex-wrap justify-content-xl-between">
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Today Sales</small>
                                <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.todaySaleAmount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Weekly Sales</small>
                                <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.thisWeekSaleAmount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Monthly Sales</small>
                                <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.thisMonthSaleAmount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Yearly Salse</small>
                                <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.thisYearSaleAmount}</h5>
                              </div>
                            </div>
                            <div class="d-flex py-3 border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-currency-usd mr-3 icon-lg text-danger"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Total Sales</small>
                                <h5 class="mr-2 mb-0">$ {dashboardData?.sale?.totalSaleAmount}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="purchases" role="tabpanel" aria-labelledby="purchases-tab">
                          <div class="d-flex flex-wrap justify-content-xl-between">
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-view-list mr-3 icon-lg text-warning"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Today Orders</small>
                                <h5 class="mr-2 mb-0">{dashboardData?.order?.todayCount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-view-list mr-3 icon-lg text-warning"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Weekly Orders</small>
                                <h5 class="mr-2 mb-0">{dashboardData?.order?.thisWeekCount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-view-list mr-3 icon-lg text-warning"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Monthly Order</small>
                                <h5 class="mr-2 mb-0">{dashboardData?.order?.thisMonthCount}</h5>
                              </div>
                            </div>
                            <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-view-list mr-3 icon-lg text-warning"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Yearly Order</small>
                                <h5 class="mr-2 mb-0">{dashboardData?.order?.thisYearCount}</h5>
                              </div>
                            </div>
                            <div class="d-flex py-3 border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                              <i class="mdi mdi-view-list mr-3 icon-lg text-warning"></i>
                              <div class="d-flex flex-column justify-content-around">
                                <small class="mb-1 text-muted">Total Order</small>
                                <h5 class="mr-2 mb-0">{dashboardData?.order?.totalCount}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Chart JS --> */}
              <div class="row">
                <div class="col-lg-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <div class="chartjs-size-monitor" style={{
                      position: "absolute",
                      inset: "0px", overflow: "hidden", pointerEvents: "none", visibility: "hidden", zIndex: "-1"
                    }}>
                      <div class="chartjs-size-monitor-expand" style={{
                        position: "absolute", left: 0, top: 0, right: "0", bottom: "0",
                        overflow: "hidden", pointerEvents: "none", visibility: "hidden", zIndex: "-1"
                      }}
                      ><div style={{
                        position: "absolute", width: "1000000px", height: "1000000px",
                        left: "0", top: "0"
                      }}></div></div><div class="chartjs-size-monitor-shrink" style={{
                        position: "absolute",
                        left: "0", top: "0", right: "0", bottom: "0", overflow: "hidden", pointerEvents: "none", visibility: "hidden",
                        zIndex: -1
                      }}>
                        <div style={{ position: "absolute", width: "200%", height: "200%", left: "0", top: "0" }}></div>
                      </div>
                    </div>
                      <div class="row">
                        <div class="col-lg-8">
                          <h4 class="card-title">Total Sales</h4>
                        </div>
                        {/* <div class="col-lg-4">
                          <select class="form-control-sm right" id="exampleFormControlSelect1">
                            <option>Jan</option>
                            <option>Feb</option>
                            <option>March</option>
                            <option>April</option>
                            <option>May</option>
                          </select>
                        </div> */}
                      </div>
                      <BarChart chartData={saleChartData} title="Total Sales" label="Total Sales during this year" />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body"><div class="chartjs-size-monitor" style={{
                      position: "absolute", inset: "0px", overflow: "hidden",
                      "pointerEvents": "none", visibility: "hidden", zIndex: "-1"
                    }}><div class="chartjs-size-monitor-expand"
                      style={{
                        position: "absolute", left: "0", top: "0", right: "0", bottom: "0", overflow: "hidden",
                        pointerEvents: "none", visibility: "hidden", zIndex: "-1"
                      }}>
                        <div style={{ position: "absolute", width: "1000000px", height: "1000000px", left: "0", top: "0" }}>
                        </div></div><div class="chartjs-size-monitor-shrink"
                          style={{
                            position: "absolute", left: "0", top: "0", right: "0", bottom: "0", overflow: "hidden",
                            pointerEvents: "none", visibility: "hidden", zIndex: "-1"
                          }}><div style={{
                            position: "absolute", width: "200%",
                            height: "200%", left: "0", top: "0"
                          }}></div>
                      </div></div>

                      <div class="row">
                        <div class="col-lg-8">
                          <h4 class="card-title">Top Products</h4>
                        </div>
                        {/* <div class="col-lg-4">
                          <select class="form-control-sm right" id="exampleFormControlSelect1">
                            <option>Item One</option>
                            <option>Item Two</option>
                            <option>Item Three</option>
                            <option>Item Four</option>
                            <option>Item Five</option>
                          </select>
                        </div> */}
                        <BarChart chartData={productChartData} title="Top Products" label="Top Products during this year" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {/* <!-- Table --> */}
              <div class="row">
                <div class="col-md-12 stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <p class="card-title">Top Best Selling Products</p>
                      <div class="table-responsive text-center">
                        <table id="recent-purchases-listing" class="table table-light table-striped table-borderless">
                          <thead>
                            <tr>
                              <th>Product Name</th>
                              <th>Category</th>
                              {/* <th>Selling Count</th> */}
                              <th>Sale Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData?.bestSellingProducts?.map((data) => {
                              return (
                                <>
                                  <tr>
                                    <td>{data?.mediaData?.name}</td>
                                    <td>{data?.mediaData?.type}</td>
                                    {/* <td>{data?.totalQuantity}</td> */}
                                    <td>${data?.totalAmountSold}</td>
                                  </tr>
                                </>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- main-panel ends --> */}
            </div>
            {/* <!-- page-body-wrapper ends --> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;