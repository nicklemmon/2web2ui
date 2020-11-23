import signupFlow from './helpers';

test('Signup flow: join', async () => {
  const page = await signupFlow();
  await page.signup();
  expect(page.currentRoute()).toEqual('/onboarding/plan');
  expect(page.mockApiCalls).toMatchSnapshot();
});
