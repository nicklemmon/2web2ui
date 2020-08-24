import React from 'react';

// todo, switch to use Text and configure as needed
const Bold = props => {
  const { id, children } = props;

  return (
    <strong data-id={props['data-id']} id={id}>
      {children}
    </strong>
  );
};

export default Bold;
