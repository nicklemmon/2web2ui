import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePageFilters } from 'src/hooks';
import links from '../constants/editNavigationLinks';
import { routeNamespace } from '../constants/routes';
import { setSubaccountQuery } from '../../../helpers/subaccounts';

const initFilters = {
  id: {},
  version: {},
  navKey: { excludeFromRoute: true },
  subaccount: {},
};

const useEditorNavigation = () => {
  const history = useHistory();
  const {
    filters: { id, version = 'draft', navKey = '', subaccount: subaccountId },
  } = usePageFilters(initFilters);
  const [navKeyTemp, setNavKeyTemp] = useState(navKey.toLowerCase());
  const setNavigation = nextNavigationKey => {
    setNavKeyTemp(nextNavigationKey.toLowerCase());
    history.push(
      `/${routeNamespace}/edit/${id}/${version}/${nextNavigationKey}${setSubaccountQuery(
        subaccountId,
      )}`,
    );
  };

  return useMemo(() => {
    let index = links.findIndex(link => link.routeKey === navKeyTemp.toLowerCase());

    if (index === -1) {
      // no match
      index = 0;
    }

    return {
      currentNavigationIndex: index,
      currentNavigationKey: links[index].key,
      setNavigation,
    };
  }, [navKeyTemp, setNavigation]);
};

export default useEditorNavigation;
