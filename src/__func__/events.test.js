import mountRoute from 'src/__testHelpers__/mountRoute';

test('Events search page', async () => {
  const wrapper = await mountRoute('/reports/message-events');
  expect(wrapper.find('TableCollection')).toExist();
});

test('Events search pagination', async () => {
  const wrapper = await mountRoute('/reports/message-events');
  await wrapper.simulate('Pager Button[disabled=false]', 'click');
  expect(wrapper.find('TableCollection')).toExist();
});
