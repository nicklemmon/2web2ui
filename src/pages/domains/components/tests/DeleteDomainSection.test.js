import React from 'react';
import { shallow } from 'enzyme';
import useDomains from '../../hooks/useDomains';
import DeleteDomainSection from '../DeleteDomainSection';
jest.mock('../../hooks/useDomains');
const mockfunc = jest.fn(() => {
  return Promise.resolve();
});

useDomains.mockImplementation(() => {
  return { deleteDomain: mockfunc, showAlert: jest.fn() };
});

describe('DeleteDomainSection', () => {
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
    history: { push: jest.fn() },
  };
  const subject = () => shallow(<DeleteDomainSection {...defaultProps} />);

  let wrapper;

  beforeEach(() => {
    wrapper = subject();
  });

  it('renders a Delete Domain Button', () => {
    expect(wrapper.find('Button')).toHaveTextContent('Delete Domain');
  });
});
