import signupFlow from './helpers';

test('Signup flow: join w/ email opt in', async () => {
  const page = await signupFlow();
  await page.signup({ optIn: true });
  expect(page.currentRoute()).toEqual('/onboarding/plan');
  expect(page.mockApiCalls).toMatchSnapshot();
  expect(page.axiosMock).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      url: '/v1/account',
      method: 'post',
      data: expect.objectContaining({ salesforce_data: { email_opt_out: false } }),
    }),
  );
});
