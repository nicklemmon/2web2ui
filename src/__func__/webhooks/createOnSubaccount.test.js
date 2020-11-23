import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';
import { use } from 'src/__testHelpers__/mockApi';

test('Webhooks: create on subaccount', async () => {
  use('subaccounts');
  const page = await mountRoute('/webhooks/create');
  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'assignTo', value: 'subaccount' },
  ]);

  await page.forceUpdate();

  const subaccount = page.store.getState().subaccounts.list[0];
  formFiller({ type: 'typeahead', name: 'subaccount', value: subaccount });

  await page.simulate('form', 'submit');
  expect(page.currentLocation()).toEqual(
    expect.objectContaining({
      pathname: '/webhooks/details/webhook-test-name',
      search: '?subaccount=1',
    }),
  );

  expect(page.mockApiCalls).toMatchSnapshot();
});
