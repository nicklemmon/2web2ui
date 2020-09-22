import React from 'react';
import { shallow } from 'enzyme';
import useDomains from '../../hooks/useDomains';
import { Button } from 'src/components/matchbox';
import SetupForSending from '../SetupForSending';
jest.mock('../../hooks/useDomains');
const mockfunc = jest.fn(() => {
  return Promise.resolve({
    mx_status: 'verified',
    spf_status: 'unverified',
    dns: {
      dkim_record:
        'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDel4OHmY5sa+LNG4F8eg5NwpS3XPwwdVNlOP/yOMjc74rvzwmS0Fi+DUdtTcuX8baZw6rfUif96LEXbxaleQ8H+hDyQxJrb6Ixr0kmV1162ZCIrAHGdlqWT9OXPu/DzGl7+KbVmmp3TaqLCDlKmSj81fmc9fteAmzgj9pp6bcIHQIDAQAB',
    },
    ownership_verified: true,
    abuse_at_status: 'unverified',
    cname_status: 'valid',
    dkim_status: 'valid',
    verification_mailbox_status: 'unverified',
    compliance_status: 'valid',
    postmaster_at_status: 'unverified',
  });
});
useDomains.mockImplementation(() => {
  return { verifyDkim: mockfunc, showAlert: jest.fn() };
});

describe('DomainStatusSection', () => {
  const defaultProps = {
    id: 'hello-2.com',
    allowDefault: true,
    allowSubaccountDefault: true,
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
  };
  const subject = () => shallow(<SetupForSending {...defaultProps} />);

  let wrapper;

  beforeEach(() => {
    wrapper = subject();
  });

  it('renders Type, Hostname and Value correctly', () => {
    expect(wrapper).toHaveTextContent('Type');
    expect(wrapper).toHaveTextContent('Hostname');
    expect(wrapper).toHaveTextContent('Value');
  });

  it('call verifyDkim when Verify Domain is clicked', () => {
    wrapper = shallow(<SetupForSending {...defaultProps} />);
    wrapper.find(Button).simulate('click');
    expect(mockfunc).toHaveBeenCalled();
  });
});
