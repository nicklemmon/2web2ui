import { useMemo, useEffect } from 'react';
import { hash } from './hash';

function useABTest(options = {}) {
  const { testName, variants = [], onVariantLoad, uid } = options;

  if (!testName) {
    throw new Error('useABTest requires a string testName');
  }

  if (!uid) {
    throw new Error(
      'useABTest requires a uid to be set. Without it, the first variant will always be chosen',
    );
  }

  if (!onVariantLoad || typeof onVariantLoad !== 'function') {
    throw new Error('useABTest requires that if onVariantLoad is passed, it must be a function');
  }

  const index = useMemo(() => hash(uid) % variants.length, [variants.length, uid]);

  const VariantComponent = variants[index];
  const variantName = VariantComponent.displayName || VariantComponent.name || 'ABTestVariant';

  useEffect(() => {
    if (onVariantLoad && uid && variantName && testName) {
      onVariantLoad({ testName, variantName, uid });
    }
  }, [onVariantLoad, testName, uid, variantName]);

  return VariantComponent;
}

export default useABTest;
