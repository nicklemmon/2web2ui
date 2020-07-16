import React from 'react';
import { shallow } from 'enzyme';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

import { FileUploadWrapperClass } from '../FileUploadWrapper';
import styles from '../FileUploadWrapper.module.scss';

jest.mock('src/hooks/useHibanaOverride');

const defaults = {
  meta: {},
  input: {},
  styles,
};

describe('FileUploadWrapper', () => {
  beforeEach(() => {
    useHibanaOverride.mockReturnValue(styles);
  });

  it('renders an error correctly', () => {
    const wrapper = shallow(
      <FileUploadWrapperClass {...defaults} meta={{ error: 'oh no', touched: true }} />,
    );
    expect(wrapper.find('Error')).toExist();
    expect(wrapper.find('Error').prop('error')).toEqual('oh no');
  });

  it('renders uploading state correctly', () => {
    const wrapper = shallow(<FileUploadWrapperClass {...defaults} uploading />);

    expect(wrapper).toHaveTextContent('Uploading...');
    expect(wrapper).toHaveTextContent('Your list will be ready to validate in just a moment.');
    expect(wrapper.find('Loading')).toExist();
  });

  it('FileUploadWrapper.handleCancel', () => {
    const props = {
      styles,
      input: {
        onBlur: jest.fn(),
      },
    };
    const instance = new FileUploadWrapperClass(props);

    instance.handleCancel();
    expect(props.input.onBlur).toHaveBeenCalled();
  });

  it('FileUploadWrapper.handleDrop', () => {
    const props = {
      styles,
      input: {
        onBlur: jest.fn(),
        onChange: jest.fn(),
      },
    };
    const file = { name: 'test.csv' };
    const instance = new FileUploadWrapperClass(props);

    instance.handleDrop([file], []);

    expect(props.input.onChange).toHaveBeenCalledWith(file);
    expect(props.input.onBlur).toHaveBeenCalled();
  });

  it('FileUploadWrapper.handleOpen', () => {
    const dropzone = {
      open: jest.fn(),
    };
    const instance = new FileUploadWrapperClass({ styles });
    instance.dropzoneRef = dropzone;

    instance.handleOpen();
    expect(dropzone.open).toHaveBeenCalled();
  });
});
