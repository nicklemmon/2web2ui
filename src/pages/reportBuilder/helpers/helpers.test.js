import * as helpers from '.';

describe('hydrate filters', () => {
  it('should hydrate filters properly', () => {
    const hydratedFilters = helpers.hydrateFilters([{ AND: { templates: { eq: ['thing'] } } }]);
    expect(hydratedFilters).toMatchSnapshot();
  });

  it('should hydrate subaccount filters correctly', () => {
    const hydratedFilters = helpers.hydrateFilters([{ AND: { subaccounts: { eq: [123] } } }], {
      subaccounts: [{ id: 123, name: 'Cool Subaccount Name' }],
    });
    expect(hydratedFilters).toMatchSnapshot();
  });
});

describe('dehydrate filters', () => {
  it('should dehydrate filters properly', () => {
    const dehydratedFilters = helpers.dehydrateFilters([
      {
        AND: {
          templates: { eq: [{ value: 'only thing left' }] },
          subaccounts: {
            notEq: [{ value: 'should be gone', id: 123, name: 'Should not be here' }],
          },
        },
      },
    ]);
    expect(dehydratedFilters).toMatchSnapshot();
  });
});
