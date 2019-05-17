import React, { createContext, useEffect } from 'react';
import useRouter from 'src/hooks/useRouter';
import useEditorContent from '../hooks/useEditorContent';
import useEditorPreview from '../hooks/useEditorPreview';
import useEditorTabs from '../hooks/useEditorTabs';

const EditorContext = createContext();

const chainHooks = (...hooks) => (
  hooks.reduce((acc, hook) => ({ ...acc, ...hook(acc) }), {})
);

export const EditorContextProvider = ({ children, value }) => {
  const { requestParams } = useRouter();
  const state = chainHooks(
    () => value,
    useEditorContent,
    useEditorPreview,
    useEditorTabs
  );

  useEffect(() => {
    state.getDraft(requestParams.id, requestParams.subaccount);
    state.getPublished(requestParams.id, requestParams.subaccount);
  }, [state.getDraft, state.getPublished, requestParams.id, requestParams.subaccount, state]);

  return (
    <EditorContext.Provider value={state}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
