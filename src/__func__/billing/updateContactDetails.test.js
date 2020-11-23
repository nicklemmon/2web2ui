import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';
import { use } from 'src/__testHelpers__/mockApi';
import { findButton } from 'src/__testHelpers__/enzyme';

test('Update account: contact info', async () => {
  use('paid');

  const page = await mountRoute('/account/billing');

  const button = findButton(page.wrapper, 'Update Billing Contact');
  await button.simulate('click');

  getFormFiller(page.wrapper)([
    { name: 'billingContact.firstName', value: 'Firsty' },
    { name: 'billingContact.lastName', value: 'Lasty' },
    { name: 'billingContact.email', value: 'something@email.test' },
    { type: 'select', name: 'billingContact.country', value: 'US' },
    { type: 'select', name: 'billingContact.state', value: 'MD' },
    { name: 'billingContact.zip', value: '12345' },
  ]);

  await page.simulate('form', 'submit');

  expect(page.mockApiCalls).toMatchSnapshot();
});
