import React from 'react';
import _ from 'lodash';
import { Box, Panel, Stack, Tag } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { Heading } from 'src/components/text';
import OGOnlyWrapper from 'src/components/hibana/OGOnlyWrapper';
import ActionPopover from 'src/components/actionPopover';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { formatDate } from 'src/helpers/date';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { routeNamespace } from '../constants/routes';
import OGStyles from './RecentActivity.module.scss';
import hibanaStyles from './RecentActivityHibana.module.scss';

const RecentActivity = props => {
  const { hasActionButtons, templates, onToggleDeleteModal, onToggleDuplicateModal } = props;
  const descendingSortedTemplates = _.orderBy(templates, 'last_update_time', 'desc');
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  if (templates.length < 3) {
    return null;
  }

  return (
    <Box mb="500">
      <Stack space="400">
        <Heading as="h2" looksLike="h3">
          Recent Activity
        </Heading>

        <div className={styles.RecentActivity} role="list">
          {descendingSortedTemplates.map((template, index) => {
            const version = template.list_status === 'draft' ? 'draft' : 'published';

            if (index <= 3) {
              return (
                <div
                  role="listitem"
                  className={styles.ListItem}
                  key={`recent-activity-template-${index}`}
                >
                  <Panel className={styles.Panel} accent>
                    <div className={styles.PanelContent}>
                      <Panel.Section>
                        <OGOnlyWrapper as="div" className={styles.PanelStack}>
                          <Stack>
                            <div>
                              {template.list_status === 'published' ||
                              template.list_status === 'published_with_draft' ? (
                                <Tag>Published</Tag>
                              ) : (
                                <Tag>Draft</Tag>
                              )}
                            </div>

                            <PageLink
                              className={styles.TemplateName}
                              to={`/${routeNamespace}/edit/${
                                template.id
                              }/${version}/content${setSubaccountQuery(template.subaccount_id)}`}
                            >
                              {template.name}
                            </PageLink>
                          </Stack>
                        </OGOnlyWrapper>
                      </Panel.Section>

                      <Panel.Section paddingTop="200" paddingBottom="200">
                        <div className={styles.Meta}>
                          <div className={styles.Date}>
                            <span>Updated&nbsp;</span>

                            {formatDate(template.last_update_time)}
                          </div>

                          {hasActionButtons && (
                            <div className={styles.Actions}>
                              <ActionPopover
                                actions={[
                                  {
                                    content: 'Duplicate Template',
                                    onClick: () => onToggleDuplicateModal(template),
                                  },
                                  {
                                    content: 'Delete Template',
                                    onClick: () => onToggleDeleteModal(template),
                                  },
                                ]}
                              />
                            </div>
                          )}
                        </div>
                      </Panel.Section>
                    </div>
                  </Panel>
                </div>
              );
            }
          })}
        </div>
      </Stack>
    </Box>
  );
};

export default RecentActivity;
