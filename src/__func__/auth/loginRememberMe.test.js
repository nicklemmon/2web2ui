import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Login with "remember me"', async () => {
  const page = await mountRoute('/auth', { authenticated: false });

  const formFiller = getFormFiller(page.wrapper);
  formFiller([
    { name: 'username', value: 'test-username' },
    { name: 'password', value: 'test-password' },
    { type: 'checkbox', name: 'rememberMe', value: true },
  ]);

  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/dashboard');
  expect(page.mockApiCalls).toMatchSnapshot();
  const authCalls = page.mockApiCalls.find(call => call[0].url === '/v1/authenticate');
  expect(authCalls[0].data).toMatch(/&rememberMe=true/);
});
