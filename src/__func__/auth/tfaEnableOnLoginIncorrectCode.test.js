import mountRoute from 'src/__testHelpers__/mountRoute';
import getFormFiller from 'src/__testHelpers__/fill';

test('TFA flow: enable on login with incorrect code', async () => {
  const page = await mountRoute('/auth', { authenticated: false });

  const formFiller = getFormFiller(page.wrapper);

  formFiller([
    { name: 'username', value: 'tfa-required-username' },
    { name: 'password', value: 'tfa-required-password' },
  ]);

  await page.simulate('form', 'submit');
  expect(page.currentRoute()).toEqual('/auth/enable-tfa');

  formFiller({ selector: 'input', value: '123456' });

  await page.simulate('button[type="submit"]', 'click');
  expect(page.currentRoute()).toEqual('/auth/enable-tfa');
  expect(page.mockApiCalls).toMatchSnapshot();
});
