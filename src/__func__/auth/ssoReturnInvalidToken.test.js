import mountRoute from 'src/__testHelpers__/mountRoute';

const SSOEncodedToken = 'probably-not-valid-base64';

test('Single sign-on flow: return from identity provider without valid token', async () => {
  const page = await mountRoute(`/sso?ad=${SSOEncodedToken}`, { authenticated: false });
  expect(page.currentRoute()).toEqual('/auth');
});
