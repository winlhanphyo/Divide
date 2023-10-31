import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

const PublicRoute = ({ isLoggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props => (
        <Component {...props}  />
    )}
  />
);

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PublicRoute);
