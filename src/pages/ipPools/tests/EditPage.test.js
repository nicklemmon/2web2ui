import { shallow } from 'enzyme';
import React from 'react';
import { EditPage } from '../EditPage';

describe('IP Pools Edit Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      match: {
        params: {
          id: 'my-pool',
        },
      },
      error: null,
      pool: {
        name: 'My Pool',
        id: 'my-pool',
        signing_domain: 'my-domain.sparkpost.com',
      },
      updatePool: jest.fn(() => Promise.resolve()),
      deletePool: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn(),
        replace: jest.fn(),
      },
      loading: false,
      listPools: jest.fn(),
      listError: null,
      showPurchaseCTA: true,
      isManuallyBilled: false,
    };

    wrapper = shallow(<EditPage {...props} />);
  });

  describe('render tests', () => {
    it('should render the edit page correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show loading when data is loading', () => {
      wrapper.setProps({ loading: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not show purchase action if showPurchaseCTA is false', () => {
      wrapper.setProps({ showPurchaseCTA: false });
      expect(wrapper).toMatchSnapshot();
    });

    it('should show support ticket link if manually billed', () => {
      wrapper.setProps({ isManuallyBilled: true });
      expect(wrapper.find('Connect(SupportTicketLink)')).toExist();
    });

    it('should list pools and get pool when calling loadDependentData', () => {
      const component = wrapper.instance();
      component.loadDependentData();
      expect(component.props.listPools).toHaveBeenCalled();
    });
  });

  describe('renderForm tests', () => {
    it('should show list error msg on error', () => {
      wrapper.setProps({ error: true, listError: { message: 'failed listing pools' } });
      expect(wrapper.find('ApiErrorBanner')).toMatchSnapshot();
    });
  });

  describe('renderIps', () => {
    it('should not render table if pool is new', () => {
      wrapper.setProps({ isNew: true });
      expect(wrapper.find({ title: 'Sending IPs' })).not.toExist();
    });

    it('should not render table if no ips exist', () => {
      wrapper.setProps({ ips: null });
      expect(wrapper.find({ title: 'Sending IPs' })).toExist();
      expect(wrapper.find('IPList')).not.toExist();
    });

    it('should not show purchase cta if showPurchaseCTA is false', () => {
      wrapper.setProps({ showPurchaseCTA: false });
      expect(wrapper.find({ title: 'Sending IPs' }).find('UnstyledLink')).not.toExist();
    });
  });

  describe('onUpdatePool tests', () => {
    it('should show an alert on successful pool update', async () => {
      await wrapper
        .instance()
        .onUpdatePool({ name: 'my_pool', signing_domain: 'my-domain.sparkpost.com' });
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Updated IP pool my-pool.',
      });
      expect(props.updatePool).toHaveBeenCalledWith('my-pool', {
        auto_warmup_overflow_pool: '',
        name: 'my_pool',
        signing_domain: 'my-domain.sparkpost.com',
      });
      expect(wrapper.instance().props.history.replace).toHaveBeenCalledWith(
        '/account/ip-pools/edit/my-pool',
      );
    });

    it('should set signing_domain to empty string if it is null', async () => {
      props.pool.signing_domain = null;
      await wrapper.instance().onUpdatePool({ name: 'my_pool' });
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Updated IP pool my-pool.',
      });
      expect(props.updatePool).toHaveBeenCalledWith('my-pool', {
        auto_warmup_overflow_pool: '',
        name: 'my_pool',
        signing_domain: '',
      });
      expect(wrapper.instance().props.history.replace).toHaveBeenCalled();
    });

    it('should not update pool if editing default pool', async () => {
      const err = new Error('You can not edit default pool.');

      wrapper.setProps({ pool: { id: 'default' } });
      await expect(
        wrapper.instance().onUpdatePool({ name: 'default', id: 'default' }),
      ).rejects.toThrow(err);
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'You can not edit default pool.',
      });

      expect(props.updatePool).not.toHaveBeenCalled();
      expect(wrapper.instance().props.history.replace).not.toHaveBeenCalled();
    });
  });

  describe('delete modal tests', () => {
    it('should toggle delete modal on cancel', () => {
      const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
      wrapper.instance().toggleDelete();
      expect(stateSpy).toHaveBeenCalledWith({ showDelete: true });
    });

    it('should show alert on delete pool', async () => {
      await wrapper.instance().onDeletePool();
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Deleted IP pool my-pool.',
      });
      expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    });
  });
});
