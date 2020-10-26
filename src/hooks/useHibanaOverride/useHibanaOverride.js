import { useHibana } from 'src/context/HibanaContext';
import { composeTheme } from '@css-modules-theme/core';

export default function useHibanaOverride(OGstyles, hibanaStyles) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  // See: https://github.com/klimashkin/css-modules-theme#composethemeoptions
  return composeTheme([{ theme: OGstyles }, { theme: isHibanaEnabled ? hibanaStyles : {} }]);
}
