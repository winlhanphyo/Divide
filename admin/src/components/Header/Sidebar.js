import { Link, useHistory } from 'react-router-dom';

const Sidebar = () => {
  const currentUrl = window.location.href;

  const checkActiveClass = (name) => {
    return currentUrl.indexOf(name) !== -1;
  }

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className={`nav-item ${checkActiveClass('home') ? "active" : ""}`}>
          <a className="nav-link" href="/admin">
            <i className="mdi mdi-home menu-icon"></i>
            <span className="menu-title">
              Home
            </span>
          </a>
        </li>
        <li className={`nav-item ${checkActiveClass('category') ? "active" : ""}`}>
          <a className="nav-link" href="/admin/category">
            <i className="mdi mdi-view-headline menu-icon"></i>
            <span className="menu-title">
              Category
            </span>
          </a>
        </li>
        <li className={`nav-item ${checkActiveClass('product') ? "active" : ""}`}>
          <Link className="nav-link" to="/admin/product">
            <i className="mdi mdi-chart-pie menu-icon"></i>
            <span className="menu-title">
              Product</span>
          </Link>
        </li>
        <li className={`nav-item ${checkActiveClass('order') ? "active" : ""}`}>
          <a className="nav-link" href="/admin/order">
            <i className="mdi mdi-grid-large menu-icon"></i>
            <span className="menu-title">Order</span>
          </a>
        </li>
        <li className={`nav-item ${checkActiveClass('user') ? "active" : ""}`}>
          <a className="nav-link" href="/admin/user">
            <i className="mdi mdi-emoticon menu-icon"></i>
            <span className="menu-title">User</span>
          </a>
        </li>
        <li className={`nav-item ${checkActiveClass('media') ? "active" : ""}`}>
          <a className="nav-link" href="/admin/media">
            <i className="mdi mdi-video menu-icon"></i>
            <span className="menu-title">Media</span>
          </a>
        </li>
        {/* <li class="nav-item">
          <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
            <i class="mdi mdi-account menu-icon"></i>
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="auth">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item"> <a class="nav-link" href="pages/samples/login.html"> Login </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/login-2.html"> Login 2 </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/register.html"> Register </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/register-2.html"> Register 2 </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/lock-screen.html"> Lockscreen </a></li>
            </ul>
          </div>
        </li> */}
        <li className={`nav-item ${checkActiveClass('password-change') ? "active" : ""}`}>
          <a className="nav-link" href="/admin/password-change">
            <i className="mdi mdi-file-document-box-outline menu-icon"></i>
            <span className="menu-title">Password Change</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar;