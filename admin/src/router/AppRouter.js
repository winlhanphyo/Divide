import React from "react";
import { Switch, Redirect, withRouter, matchPath } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/Login/LoginPage";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import ForgetPasswordUpdate from "../pages/ForgetPasswordUpdate/ForgetPasswordUpdate";
import UserPage from "../pages/User/UserPage";
import HomePage from "../pages/Home/HomePage";
import CategoryPage from "../pages/Category/CategoryPage";
import CreateCategoryPage from "../pages/Category/CreateCategoryPage";
import EditCategoryPage from "../pages/Category/EditCategoryPage";
import CreateProductPage from "../pages/Product/CreateProductPage";
import EditProductPage from "../pages/Product/EditProductPage";
import ProductPage from "../pages/Product/ProductPage";
import Footer from "../components/Footer/Footer";
import ProfilePage from "../pages/Profile/ProfilePage";
import EditUserPage from "../pages/User/EditUserPage";
import CreateUserPage from "../pages/User/CreateUserPage";
import OrderPage from "../pages/Order/OrderPage";
import EditOrderPage from "../pages/Order/EditOrderPage";
import OrderDetailPage from "../pages/Order/OrderDetailPage";
import PasswordChange from "../pages/PasswordChange/PasswordChange";
import MediaPage from "../pages/Media/MediaPage";

import StripePayment from "../pages/Stripe/StripePayment";
import Success from "../pages/Stripe/Success";
import Cancel from "../pages/Stripe/Cancel";
import CreateMediaPage from "../pages/Media/CreateMediaPage";

const AppRouter = withRouter(({ location }) => {

  /**
   * make path for each component.
   */
  return (
    <>
      {/* {
        (location.pathname !== '/admin/login' && location.pathname !== '/admin/forgetPassword' && !matchPath(location.pathname, '/admin/ForgetPasswordUpdate/:token')) && <Header showMenu={true} />
      } */}
      <Switch>
        <PrivateRoute path="/admin/category/create" component={CreateCategoryPage} />
        <PrivateRoute path="/admin/category/:id/edit" component={EditCategoryPage} />
        <PrivateRoute path="/admin/category" component={CategoryPage} />
        <PrivateRoute path="/admin/product/:id/edit" component={EditProductPage} />
        <PrivateRoute path="/admin/product/create" component={CreateProductPage} />
        <PrivateRoute path="/admin/product" component={ProductPage} />
        <PrivateRoute path="/admin/user/:id/edit" component={EditUserPage} />
        <PrivateRoute path="/admin/user/create" component={CreateUserPage} />
        <PrivateRoute path="/admin/user" component={UserPage} />
        <PrivateRoute path="/admin/password-change" component={PasswordChange} />
        <PrivateRoute path="/admin/order/:id/edit" component={EditOrderPage} />
        <PrivateRoute path="/admin/order/:id" component={OrderDetailPage} />
        <PrivateRoute path="/admin/order" component={OrderPage} />
        <PublicRoute path="/admin/login" component={LoginPage} />
        <PublicRoute path="/admin/forget-password" component={ForgetPassword} />
        <PublicRoute path="/admin/forget-password-update/:userId/:token" component={ForgetPasswordUpdate} />
        <PrivateRoute path="/admin/profile" component={ProfilePage} />
        <PrivateRoute path="/admin/home" component={HomePage} />
        <PrivateRoute path="/admin/media/create" component={CreateMediaPage} />
        <PrivateRoute path="/admin/media" component={MediaPage} />

        <PrivateRoute path="/success" component={Success} />
        <PrivateRoute path="/cancel" component={Cancel} />
        <PrivateRoute path="/payment" component={StripePayment} />

        {/* Redirect all 404's to home */}
        <Redirect to='/admin/home' />
      </Switch>
      {
        (location.pathname !== '/admin/login' && location.pathname !== '/admin/forget-password' && !matchPath(location.pathname, '/forget-password-update/:token')) && <Footer />
      }
    </>
  )
})

export default AppRouter;
