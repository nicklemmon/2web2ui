import React from 'react';
import { shallow } from 'enzyme';
import { SaveNewReportModal } from '../SaveNewReportModal';
import useRouter from 'src/hooks/useRouter';
jest.mock('src/hooks/useRouter');
useRouter.mockReturnValue({
  location: { search: '?metrics=sent_count' },
});
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: true }]),
}));

const mockOnCancel = jest.fn();
const mockCreateReport = jest.fn(() => Promise.resolve());
const mockGetReports = jest.fn(() => Promise.resolve());
const mockShowAlert = jest.fn();

describe('SaveNewReportModal', () => {
  const subject = props => {
    const defaults = {
      open: true,
      onCancel: mockOnCancel,
      createReport: mockCreateReport,
      getReports: mockGetReports,
      showAlert: mockShowAlert,
      loading: false,
    };

    return shallow(<SaveNewReportModal {...defaults} {...props} />);
  };

  it('renders page correctly', () => {
    const wrapper = subject();
    expect(wrapper).toHaveTextContent('Name');
    expect(wrapper).toHaveTextContent('Description');
    expect(wrapper).toHaveTextContent('Editable');
    expect(wrapper).toHaveTextContent('Save Report');
    expect(wrapper).toHaveTextContent('Cancel');
  });

  it('shows loading symbol when loading', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper.find('Loading')).toExist();
  });

  it('calls onCancel when clicking cancel button', () => {
    const wrapper = subject();
    wrapper.find('Button[variant="secondary"]').simulate('click');
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls createReport when clicking submit button and closes and shows alert on success', async () => {
    const wrapper = subject();
    await wrapper.find('form').simulate('submit');
    expect(mockCreateReport).toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockGetReports).toHaveBeenCalled();
  });
});
