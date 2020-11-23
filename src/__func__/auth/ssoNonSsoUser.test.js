import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Single sign-on flow: non SSO user', async () => {
  const page = await mountRoute('/auth/sso', { authenticated: false });
  const formFiller = getFormFiller(page.wrapper);
  formFiller({ name: 'username', value: 'test-username' });
  await page.simulate('form', 'submit');

  expect(global.window.location.assign).not.toHaveBeenCalled();

  expect(page.find('Error')).toExist();

  expect(page.mockApiCalls).toMatchSnapshot();
});
