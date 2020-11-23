import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Webhooks: create with basic auth', async () => {
  const page = await mountRoute('/webhooks/create');
  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'select', name: 'auth', value: 'basic' },
    { name: 'basicUser', value: 'my-basic-auth-username' },
    { name: 'basicPass', value: 'my-basic-auth-password' },
  ]);

  await page.simulate('form', 'submit');
  expect(page.currentRoute()).toEqual('/webhooks/details/webhook-test-name');
  expect(page.mockApiCalls).toMatchSnapshot();
});
