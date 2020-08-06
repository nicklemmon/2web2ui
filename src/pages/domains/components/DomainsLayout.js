import React from 'react';
import { connect } from 'react-redux';

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => {
  // TODO: Will eventually incorporate feature-level context for use via a hook
  return <>{props.children}</>;
});
