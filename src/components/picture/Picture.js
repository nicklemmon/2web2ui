import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledFigure = styled.figure`
  height: 100%;
  margin: 0; /* Resets default margins */
`;

const StyledPicture = styled.picture`
  /* Just resetting some default styles on the <picture> element */
  line-height: 0;
  font-size: 0;
`;

const StyledImg = styled.img`
  width: 100%; /* Contains <img /> within parent */
  height: 100%;
  object-fit: cover;
  mix-blend-mode: ${props =>
    props.seeThrough === true ? 'multiply' : 'unset'}; /* applies a sort of faux transparency */
`;

function Picture({ children, role, className }) {
  // a11y note: `<figure/>` is used here to supply a role and assist with skipping presentational images for screen reader users
  return (
    <StyledFigure role={role} className={className}>
      <StyledPicture>{children}</StyledPicture>
    </StyledFigure>
  );
}

function Source({ srcSet, type }) {
  return <source srcSet={srcSet} type={type} />;
}

function Img({ alt, src, className, seeThrough }) {
  return <StyledImg src={src} alt={alt} className={className} seeThrough={seeThrough} />;
}

Picture.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
  className: PropTypes.string,
};

Source.propTypes = {
  srcSet: PropTypes.string,
  type: PropTypes.string,
};

Img.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  seeThrough: PropTypes.bool,
  className: PropTypes.string,
};

Img.defaultProps = {
  seeThrough: false,
};

Img.displayName = 'Picture.Img';
Source.displayName = 'Picture.Source';
Picture.Source = Source;
Picture.Img = Img;

export default Picture;
