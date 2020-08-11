import React from 'react';
import { render, screen } from '@testing-library/react';
import TranslatableText from '../TranslatableText';

describe('TranslatableText', () => {
  it('renders as a <span> with passed in children', () => {
    render(<TranslatableText>Hello, world.</TranslatableText>);

    expect(screen.getByText('Hello, world.')).toBeInTheDocument();
    expect(document.querySelector('span')).toBeTruthy();
  });
});
