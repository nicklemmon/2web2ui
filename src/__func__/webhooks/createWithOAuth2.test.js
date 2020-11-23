import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Webhooks: create with OAuth2', async () => {
  const page = await mountRoute('/webhooks/create');
  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'select', name: 'auth', value: 'oauth2' },
    { name: 'clientId', value: 'my-client-id' },
    { name: 'clientSecret', value: 'my-client-secret' },
    { name: 'tokenURL', value: 'https://oauth2.webhooks.com/token' },
  ]);

  await page.simulate('form', 'submit');
  expect(page.currentRoute()).toEqual('/webhooks/details/webhook-test-name');
  expect(page.mockApiCalls).toMatchSnapshot();
});
