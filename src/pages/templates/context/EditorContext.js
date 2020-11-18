import React, { createContext, useEffect } from 'react';
import { usePageFilters } from 'src/hooks';
import useEditorAnnotations from '../hooks/useEditorAnnotations';
import useEditorContent from '../hooks/useEditorContent';
import useEditorNavigation from '../hooks/useEditorNavigation';
import useEditorPreview from '../hooks/useEditorPreview';
import useEditorTabs from '../hooks/useEditorTabs';
import useEditorTestData from '../hooks/useEditorTestData';

const EditorContext = createContext();

const chainHooks = (...hooks) => hooks.reduce((acc, hook) => ({ ...acc, ...hook(acc) }), {});

const initFilters = {
  id: {},
  subaccount: {},
  version: {},
};

export const EditorContextProvider = ({
  children,
  value: { getDraft, getPublished, listDomains, listSubaccounts, ...value },
}) => {
  const { filters } = usePageFilters(initFilters);
  const pageValue = chainHooks(
    () => value,
    useEditorContent,
    useEditorNavigation,
    useEditorTestData,
    useEditorPreview, // must follow `useEditorContent` and `useEditorTestData`
    useEditorAnnotations, // must follow `useEditorContent` and `useEditorTestData`
    useEditorTabs,
  );

  useEffect(() => {
    getDraft(filters.id, filters.subaccount);
    listDomains();
    listSubaccounts();

    if (filters.version === 'published') {
      getPublished(filters.id, filters.subaccount);
    }
  }, [
    listSubaccounts,
    listDomains,
    getDraft,
    getPublished,
    filters.id,
    filters.version,
    filters.subaccount,
  ]);

  return <EditorContext.Provider value={pageValue}>{children}</EditorContext.Provider>;
};

export default EditorContext;
