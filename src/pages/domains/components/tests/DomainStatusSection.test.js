import React from 'react';
import { shallow } from 'enzyme';
import DomainStatusSection from '../DomainStatusSection';
import useDomains from '../../hooks/useDomains';
import { Checkbox } from 'src/components/matchbox';
jest.mock('../../hooks/useDomains');
const mockfunc = jest.fn(() => {
  return Promise.resolve();
});
useDomains.mockImplementation(() => {
  return { updateSendingDomain: mockfunc, allowDefault: true, allowSubaccountDefault: true };
});

describe('DomainStatusSection', () => {
  const defaultProps = {
    id: 'hello-2.com',
    domain: {
      id: 'hello-2.com',
      dkim: {
        signing_domain: 'hello-2.com',
        headers: 'from:to:subject:date',
        public:
          'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpiANdZRxauv72XRP72eLbKav/4ohDpJD9Mye3eh+02++djlfvjfaxdRUVTFd5hkpCPlAHqVIMqyjQwvbCSwmj8ttzVbVfLA18w+nHJP77NihXJ3kbpGqQrXMVAY4vb/DhMWhfBzPctDw6CHrz3aV957DiK5+l0SlwXyIcwa5JvwIDAQAB',
        selector: 'scph0920',
      },
      creation_time: '2020-09-21T18:19:47+00:00',
      is_default_bounce_domain: false,
      subaccount_id: 136,
      status: {
        mx_status: 'unverified',
        spf_status: 'unverified',
        cname_status: 'unverified',
        ownership_verified: false,
        abuse_at_status: 'unverified',
        compliance_status: 'valid',
        verification_mailbox_status: 'unverified',
        dkim_status: 'unverified',
        postmaster_at_status: 'unverified',
      },
      dkimHostname: 'scph0920._domainkey.hello-2.com',
      dkimValue:
        'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpiANdZRxauv72XRP72eLbKav/4ohDpJD9Mye3eh+02++djlfvjfaxdRUVTFd5hkpCPlAHqVIMqyjQwvbCSwmj8ttzVbVfLA18w+nHJP77NihXJ3kbpGqQrXMVAY4vb/DhMWhfBzPctDw6CHrz3aV957DiK5+l0SlwXyIcwa5JvwIDAQAB',
    },
    isTracking: false,
  };
  const subject = () => shallow(<DomainStatusSection {...defaultProps} />);

  let wrapper;

  beforeEach(() => {
    wrapper = subject();
  });

  it('renders the Subaccount number if it is present', () => {
    expect(wrapper).toHaveTextContent('Subaccount Assignment');
    expect(wrapper).toHaveTextContent(defaultProps.domain.subaccount_id);
  });

  it('renders the Share with all subaccounts toggle if the subaccount number is not present', () => {
    defaultProps.domain.subaccount_id = null;
    wrapper = shallow(<DomainStatusSection {...defaultProps} />);
    expect(wrapper.find('ToggleBlock')).toHaveLength(1);
    expect(wrapper.find({ label: 'Share this domain with all subaccounts' })).toHaveLength(1);
  });

  it('render the "Set as Default Bounce Domain" checkbox only when condition is met', () => {
    defaultProps.domain.status.ownership_verified = true;
    defaultProps.domain.status.mx_status = 'valid';
    wrapper = shallow(<DomainStatusSection {...defaultProps} />);
    expect(wrapper.find('Checkbox')).toHaveLength(1);
  });

  it('renders the correct value for "Set as Default Bounce Domain" checkbox', () => {
    defaultProps.domain.is_default_bounce_domain = true;
    defaultProps.domain.status.ownership_verified = true;
    defaultProps.domain.status.mx_status = 'valid';
    wrapper = shallow(<DomainStatusSection {...defaultProps} />);
    expect(wrapper.find({ checked: true })).toHaveLength(1);
  });

  it('call updateSendingDomain when "Set as Default Bounce Domain" is checked or unchecked', () => {
    defaultProps.domain.is_default_bounce_domain = true;
    defaultProps.domain.status.ownership_verified = true;
    defaultProps.domain.status.mx_status = 'valid';
    wrapper = shallow(<DomainStatusSection {...defaultProps} />);
    wrapper.find(Checkbox).simulate('click');
    expect(mockfunc).toHaveBeenCalled();
  });
});
