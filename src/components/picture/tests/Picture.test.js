import React from 'react';
import AccountsImgWebp from '@sparkpost/matchbox-media/images/Accounts.webp';
import AccountsImg from '@sparkpost/matchbox-media/images/Accounts.jpg';
import { render, screen } from '@testing-library/react';
import Picture from '../Picture';

describe('Picture', () => {
  it('renders with passed in children', () => {
    render(<Picture>Hello!</Picture>);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders with a child Picture.Img with a `src`', () => {
    render(
      <Picture>
        <Picture.Img src={AccountsImg} />
      </Picture>,
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'Accounts.jpg');
  });

  it('renders with passed in alt text', () => {
    render(
      <Picture>
        <Picture.Img alt="A potato" />
      </Picture>,
    );

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'A potato');
  });

  it('renders with passed in class names on the img and figure elements', () => {
    const { container } = render(
      <Picture className="this-is-a-figure">
        <Picture.Img className="this-is-an-img" />
      </Picture>,
    );
    const figureEl = container.querySelector('figure.this-is-a-figure');
    const imgEl = container.querySelector('img.this-is-an-img');

    expect(figureEl).toBeTruthy();
    expect(imgEl).toBeTruthy();
  });

  it('renders with child <Picture.Source /> components as HTML source elements', () => {
    const { container } = render(
      <Picture>
        <Picture.Source srcSet={AccountsImgWebp} type="image/webp" />
        <Picture.Img src={AccountsImg} alt="This is an image" />
      </Picture>,
    );
    const sourceEl = container.querySelector('source');

    expect(sourceEl).toBeTruthy();
    expect(sourceEl).toHaveAttribute('srcset', 'Accounts.webp');
    expect(sourceEl).toHaveAttribute('type', 'image/webp');
  });
});
