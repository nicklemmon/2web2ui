import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';
import { use } from 'src/__testHelpers__/mockApi';
import { findButton } from 'src/__testHelpers__/enzyme';

test('Update account: payment info', async () => {
  use('paid');

  const page = await mountRoute('/account/billing');

  const button = findButton(page.wrapper, 'Update Payment Information');
  await button.simulate('click');

  getFormFiller(page.wrapper)([
    { name: 'card.number', value: '4111111111111111' },
    { name: 'card.name', value: 'Person Face' },
    { name: 'card.expCombined', value: '10 / 2022' },
    { name: 'card.securityCode', value: 123 },

    { type: 'select', name: 'billingAddress.country', value: 'US' },
    { type: 'select', name: 'billingAddress.state', value: 'MD' },
    { name: 'billingAddress.zip', value: '12345' },
  ]);

  await page.simulate('form', 'submit');

  expect(page.mockApiCalls).toMatchSnapshot();
});
