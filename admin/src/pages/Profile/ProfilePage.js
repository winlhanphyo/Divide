import Header from "../../components/Header/Header";
import Sidebar from "../../components/Header/Sidebar";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("admin"));

  return (
    <div class="container-scroller">
    <Header />
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
                  <h4 class={`card-title ${styles.cardTitle}`}>Profile</h4>
                  <div className={`row ${styles.profileRow}`}>
                    <div class="col-md-3">
                      First Name
                    </div>
                    <div class="col-md-6">
                      {user.firstName}
                    </div>
                  </div>

                  <div className={`row ${styles.profileRow}`}>
                    <div class="col-md-3">
                      Last Name
                    </div>
                    <div class="col-md-6">
                      {user.lastName}
                    </div>
                  </div>

                  <div className={`row ${styles.profileRow}`}>
                    <div class="col-md-3">
                      Email
                    </div>
                    <div class="col-md-6">
                      {user.email}
                    </div>
                  </div>

                  <div className={`row ${styles.profileRow}`}>
                    <div class="col-md-3">
                      Type
                    </div>
                    <div class="col-md-6">
                      {user.type}
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
  );
}

export default ProfilePage;