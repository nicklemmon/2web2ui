import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';
import { use } from 'src/__testHelpers__/mockApi';

test('Webhooks: create on master account', async () => {
  use('subaccounts');
  const page = await mountRoute('/webhooks/create');
  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'assignTo', value: 'master' },
  ]);

  await page.simulate('form', 'submit');
  expect(page.currentLocation()).toEqual(
    expect.objectContaining({
      pathname: '/webhooks/details/webhook-test-name',
      search: '?subaccount=0',
    }),
  );

  expect(page.mockApiCalls).toMatchSnapshot();
});
