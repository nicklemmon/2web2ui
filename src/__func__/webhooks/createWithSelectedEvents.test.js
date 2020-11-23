import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Webhooks: create with selected events', async () => {
  const page = await mountRoute('/webhooks/create');
  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'eventsRadio', value: 'select' },
    { type: 'checkbox', name: 'events.bounce', value: true },
    { type: 'checkbox', name: 'events.spam_complaint', value: true },
  ]);

  await page.simulate('form', 'submit');
  expect(page.currentRoute()).toEqual('/webhooks/details/webhook-test-name');
  expect(page.mockApiCalls).toMatchSnapshot();
});
