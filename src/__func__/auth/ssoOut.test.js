import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('Single sign-on flow: navigate to identity provider', async () => {
  const page = await mountRoute('/auth/sso', { authenticated: false });
  const formFiller = getFormFiller(page.wrapper);
  formFiller({ name: 'username', value: 'sso-username' });
  await page.simulate('form', 'submit');

  // Note: jdom does not implement navigation. It will throw if you attempt it so we
  // install a mock in config/jest/setup.js and use it here instead.
  expect(global.window.location.assign).toHaveBeenCalledTimes(1);
  expect(global.window.location.assign.mock.calls[0][0]).toMatch(
    /\/v1\/users\/saml\/login\/sso-username/,
  );

  expect(page.mockApiCalls).toMatchSnapshot();
});
