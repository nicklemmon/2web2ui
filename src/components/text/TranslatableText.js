import React from 'react';

/*
  Seems like a useless component on its face! This is merely intended to be a little more self-documenting
  than the large volume of raw `<span>` tags in the application that address the following issue:
  https://github.com/facebook/react/issues/11538
*/
export default function TranslatableText({ children }) {
  return <span>{children}</span>;
}
