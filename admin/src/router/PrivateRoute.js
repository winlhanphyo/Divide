import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props =>
      isLoggedIn ? (
        <div>
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/admin/login" />
      )
    }
  />
);

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PrivateRoute);
