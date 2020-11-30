import React from 'react';
import { shallow } from 'enzyme';
import { render, queryByText } from '@testing-library/react';
import { hash } from './hash';
import useABTest from './useABTest';

jest.mock('./hash');

const VariantA = () => <h1>a</h1>;

const VariantB = () => <h1>b</h1>;

const VariantC = () => <h1>c</h1>;

describe('useABTest', () => {
  const MockComponent = ({ testName, variants, uid, onVariantLoad = () => {} }) => {
    const Variant = useABTest({ testName, variants, uid, onVariantLoad });
    return <Variant />;
  };

  const subject = (testName, variants, uid, onVariantLoad) => {
    return render(
      <MockComponent
        variants={variants}
        uid={uid}
        onVariantLoad={onVariantLoad}
        testName={testName}
      />,
    );
  };

  it('gets the same variant based on hash', () => {
    hash.mockImplementation(() => '1');
    const { container: container1 } = subject('Test 1', [VariantA, VariantB, VariantC], '123');
    const { container: container2 } = subject('Test 1', [VariantA, VariantB, VariantC], '123');

    expect(queryByText(container1, 'b')).toBeInTheDocument();
    expect(queryByText(container2, 'b')).toBeInTheDocument();
  });

  it('gets a different variant based on hash', () => {
    hash.mockImplementation(() => '0');
    const { container: container1 } = subject('Test 1', [VariantA, VariantB, VariantC], '123');
    hash.mockImplementation(() => '1');
    const { container: container2 } = subject('Test 1', [VariantA, VariantB, VariantC], '234');

    expect(queryByText(container1, 'a')).toBeInTheDocument();
    expect(queryByText(container2, 'b')).toBeInTheDocument();
  });

  it('calls onVariantLoad', () => {
    hash.mockImplementation(() => '0');
    const onVariantLoad = jest.fn();
    subject('Test 1', [VariantA, VariantB, VariantC], '123', onVariantLoad);
    expect(onVariantLoad).toBeCalledWith({
      uid: '123',
      testName: 'Test 1',
      variantName: 'VariantA',
    });
  });

  it("throws an error if the test doesn't have a test name", () => {
    expect(() => {
      shallow(<MockComponent />);
    }).toThrowError('useABTest requires a string testName');
  });

  it("throws an error if the test doesn't have a uid", () => {
    expect(() => {
      shallow(<MockComponent testName="Test" />);
    }).toThrowError(
      'useABTest requires a uid to be set. Without it, the first variant will always be chosen',
    );
  });

  it("throws an error if the test doesn't have a function for onVariantLoad", () => {
    expect(() => {
      shallow(<MockComponent testName="Test" uid="123" onVariantLoad="abc" />);
    }).toThrowError('useABTest requires that if onVariantLoad is passed, it must be a function');
  });
});
