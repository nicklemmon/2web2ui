import { useContext } from 'react';

/**
 * Generic context hook to provide re-usable error handling.
 * When creating context, set a display name (https://reactjs.org/docs/context.html#contextdisplayname)
 * for improved error handling.
 */
export default function useProvidedContext(ProvidedContext) {
  const context = useContext(ProvidedContext);
  const displayName = ProvidedContext.displayName;

  if (context === undefined) {
    throw new Error(
      `${displayName ? displayName : 'Passed in context'} must be used within a ${
        displayName ? `${displayName}.Provider.` : 'relevant provider.'
      }`,
    );
  }

  return context;
}
