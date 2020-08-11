import React from 'react';
import { shallow } from 'enzyme';
import { ListForm } from '../ListForm';

describe('ListForm', () => {
  let props;
  let formValuesWithCsv;
  let wrapper;

  beforeEach(() => {
    formValuesWithCsv = {
      csv: 'email,foo@address.com\nbar@address.com\n',
    };

    props = {
      handleSubmit: jest.fn(a => () => a(formValuesWithCsv)),
      history: {
        push: jest.fn(),
      },
      uploadList: jest.fn(() => Promise.resolve({ list_id: 'A1C1_D1C1' })),
      reset: jest.fn(),
      showAlert: jest.fn(),
      resetUploadError: jest.fn(),
    };

    wrapper = shallow(<ListForm {...props} />);
  });

  it('renders correctly', () => {
    wrapper.setProps(props);

    expect(wrapper.find('Field[name="csv"]')).toExist();
  });

  it('should submit csv', async () => {
    wrapper.setProps({ ...props, file: { size: 45, name: 'test.csv' } });

    const csvUpload = props.uploadList.mock.calls[0][0];
    await expect(props.uploadList).toHaveBeenCalledTimes(1);

    expect(csvUpload).toBeInstanceOf(FormData);
    expect(csvUpload.get('myupload')).toEqual(formValuesWithCsv.csv);
    expect(props.reset).toHaveBeenCalledWith('rvAddPaymentForm');
    expect(props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Recipients Uploaded',
    });
    expect(props.history.push).toHaveBeenCalledWith('/recipient-validation/list/A1C1_D1C1');
  });

  it('should not submit csv when over size limit', () => {
    wrapper.setProps({ ...props, file: { size: 20971521 } });
    expect(props.uploadList).not.toHaveBeenCalled();
  });

  it('should not submit if not type csv or txt', () => {
    wrapper.setProps({ ...props, file: { name: 'thing.doc' } });
    expect(props.uploadList).not.toHaveBeenCalled();
  });

  it('should not submit csv with an error', () => {
    wrapper.setProps({ ...props, file: { size: 45, name: 'test.csv' }, listError: 'error' });
    expect(props.uploadList).not.toHaveBeenCalled();
  });

  it('should reset list error', () => {
    wrapper.setProps({ ...props, listError: 'error' });
    expect(props.resetUploadError).toHaveBeenCalledTimes(1);
  });
});
