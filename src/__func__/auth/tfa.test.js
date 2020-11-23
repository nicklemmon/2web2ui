import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('TFA flow', async () => {
  const page = await mountRoute('/auth', { authenticated: false });

  const formFiller = getFormFiller(page.wrapper);
  formFiller([
    { name: 'username', value: 'tfa-username' },
    { name: 'password', value: 'tfa-password' },
  ]);

  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/auth/tfa');

  formFiller({ name: 'code', value: '314159' });
  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/dashboard');
  expect(page.mockApiCalls).toMatchSnapshot();
});
