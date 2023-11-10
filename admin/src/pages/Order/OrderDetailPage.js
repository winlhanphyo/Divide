import React from 'react';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { Document, Page, pdfjs } from 'react-pdf';
import VideoThumbnail from 'react-video-thumbnail';
import { imageURL } from '../../utils/constants/constant';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import axios from '../../axios/index';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from "./Order.module.scss";
import '../../pdf.css';
import '../../thumbnail.css';

const OrderDetailPage = () => {
  const param = useParams();
  const [loading, setLoading] = React.useState(false);
  const [orderDetail, setOrderDetail] = React.useState(null);

  React.useEffect(() => {
    let id = param['id'];
    setLoading(true);
    axios.get(`/v1/order/${id}`).then((dist) => {
      console.log('dist', dist);
      setLoading(false);
      setOrderDetail(dist?.data?.data);
    }).catch((err) => {
      setLoading(false);
      swal("Oops!", "Get Order API Error", "error");
    })
  }, []);

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
                    <h4 class="card-title">Order Detail</h4>

                    <div class="container">
                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Customer Name:
                        </div>
                        <div class="col-sm-8">
                          {`${orderDetail?.firstName} ${orderDetail?.lastName}`}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Account Name:
                        </div>
                        <div class="col-sm-8">
                          {`${orderDetail?.customerData?.firstName} ${orderDetail?.customerData?.lastName}`}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Country:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.country}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Company:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.company}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Address:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.address}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Additional Info:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.additionalInfo}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          City:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.city}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Postal Code:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.postalCode}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Phone:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.phone}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Updated User:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.updated_user_id && `${orderDetail?.updated_user_id?.firstName} ${orderDetail?.updated_user_id?.lastName}`}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Status:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.status && `${orderDetail?.status}`}
                        </div>
                      </div>

                      <div className={`row ${styles.orderInfoRow}`}>
                        <div class="col-sm-4">
                          Payment:
                        </div>
                        <div class="col-sm-8">
                          {orderDetail?.paymentDone ? "done" : "not paid" }
                        </div>
                      </div>

                    </div>

                    <div className={`container order-detail-container ${styles.orderDetailContainer}`}>

                      {orderDetail?.orderDetail?.map((dist, index) => {
                        return (<>
                          {index > 0 &&
                            <hr class="hr hr-blurry" />
                          }
                          <div className={`row ${styles.orderDetailRow}`}>
                            <div class="col-md-3">

                              { dist?.mediaData?.type === "text" ?
                                      (
                                        <Document
                                          file={imageURL +  dist?.mediaData?.url}>
                                          <Page pageNumber={1} />
                                        </Document>
                                      )
                                      :
                                      dist?.mediaData?.type === "video" ?
                                      (
                                        <VideoThumbnail
                                          videoUrl={imageURL +  dist?.mediaData?.url}
                                          // thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                          width={200}
                                          height={200}
                                        />
                                      )
                                      :
                                      (
                                        <>
                                          <img className={styles.orderImg} src={imageURL + dist?.mediaData?.cover} />
                                        </>
                                      )
                                    }
                            </div>
                            <div className={`col-md-9 ${styles.orderDetailInfo}`}>
                              <div className={`container ${styles.orderDetailInfoContainer}`}>

                                <div className={`row ${styles.orderDetailItem}`}>
                                  <div className="col-md-6">
                                    Media Name
                                  </div>
                                  <div className="col-md-6">
                                    {dist?.mediaData?.name}
                                  </div>
                                </div>

                                <div className={`row ${styles.orderDetailItem}`}>
                                  <div className="col-md-6">
                                    Amount
                                  </div>
                                  <div className="col-md-6">
                                   € {dist?.amount}
                                  </div>
                                </div>

                              </div>

                            </div>
                          </div>
                        </>)
                      })
                      }
                    </div>

                    <hr class="hr hr-blurry" />
                    <div className={styles.totalAmountRow}>
                      <div className={styles.totalAmount}>
                        Total Amount:
                      </div>
                      <div className={styles.totalAmount}>
                       € {orderDetail?.totalAmount}
                      </div>
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

  )
}

export default OrderDetailPage;