import React, { createContext } from 'react';
import { connect } from 'react-redux';

export const AuthContext = createContext();

function Provider(props) {
  const { children, auth } = props;

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export const AuthContextProvider = connect(mapStateToProps, {})(Provider);
