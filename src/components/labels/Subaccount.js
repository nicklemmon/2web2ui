import React from 'react';
import PropTypes from 'prop-types';
import { shrinkToFit } from 'src/helpers/string';

const Subaccount = ({ id, name, all, receiveAll, master, isDefault }) => {
  let content = null;
  let defaultContent = null;

  if (id) {
    content = name ? `${shrinkToFit(name, 12)} (${id})` : `Subaccount ${id}`;
  }

  if (isDefault) {
    defaultContent = ' (Default)';
  }

  if (all) {
    content = 'Shared with all';
  }

  if (receiveAll) {
    content = 'All';
  }

  if (master) {
    content = 'Primary Account';
  }

  if (!content && !defaultContent) {
    return null;
  }

  return (
    <>
      {content}
      {defaultContent}
    </>
  );
};

Subaccount.propTypes = {
  // 'Subaccount ${id}'
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // 'Shared with all'
  all: PropTypes.bool,

  // 'Primary account'
  master: PropTypes.bool,

  // 'All'
  receiveAll: PropTypes.bool,

  // Makes the tag orange and appends '(Default)'
  isDefault: PropTypes.bool,
};

Subaccount.defaultProps = {
  id: null,
  all: false,
  master: false,
  isDefault: false,
  receiveAll: false,
};

export default Subaccount;
