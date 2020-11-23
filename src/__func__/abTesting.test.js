import mountRoute from 'src/__testHelpers__/mountRoute';

test('A/B testing edit page', async () => {
  const { wrapper } = await mountRoute('/ab-testing/101/1');
  expect(wrapper.find('Page')).toExist();
});
