import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('TFA flow: incorrect code', async () => {
  const page = await mountRoute('/auth', { authenticated: false });

  const formFiller = getFormFiller(page.wrapper);
  formFiller([
    { name: 'username', value: 'tfa-username' },
    { name: 'password', value: 'tfa-password' },
  ]);

  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/auth/tfa');

  formFiller([{ name: 'code', value: '123456' }]);
  await page.simulate('form', 'submit');

  expect(page.currentRoute()).toEqual('/auth/tfa');
  expect(page.mockApiCalls).toMatchSnapshot();
});
