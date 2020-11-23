import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Login flow: incorrect credentials', async () => {
  const page = await mountRoute('/auth', { authenticated: false });

  const formFiller = getFormFiller(page.wrapper);
  formFiller([
    { name: 'username', value: 'incorrect-username' },
    { name: 'password', value: 'incorrect-password' },
  ]);

  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/auth');
  expect(page.mockApiCalls).toMatchSnapshot();
});
