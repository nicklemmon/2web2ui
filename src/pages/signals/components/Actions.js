import React from 'react';
import PropTypes from 'prop-types';
import { Warning, CheckCircleOutline } from '@sparkpost/matchbox-icons';
import { formatDate } from 'src/helpers/date';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { Empty } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { ExternalLink, PageLink } from 'src/components/links';
import ChartHeader from './ChartHeader';
import OGStyles from './Actions.module.scss';
import hibanaStyles from './ActionsHibana.module.scss';

const Action = ({ content, link, type = 'bad', internal = false, linkText = 'Learn More' }) => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  let iconMarkup;

  const linkMarkup =
    link &&
    (internal ? (
      <PageLink to={link} className={styles.Link}>
        {linkText}
      </PageLink>
    ) : (
      <ExternalLink to={link} className={styles.Link}>
        {linkText}
      </ExternalLink>
    ));

  if (type === 'bad') {
    iconMarkup = (
      <div className={styles.IconBad}>
        <Warning size={25} />
      </div>
    );
  }

  if (type === 'good') {
    iconMarkup = (
      <div className={styles.IconGood}>
        <CheckCircleOutline size={25} />
      </div>
    );
  }

  if (type === 'warning') {
    iconMarkup = (
      <div className={styles.IconWarning}>
        <Warning size={25} />
      </div>
    );
  }

  return (
    <div className={styles.ActionWrapper}>
      <div className={styles.Action}>
        {iconMarkup}
        <p>
          {content} {linkMarkup}
        </p>
      </div>
      <hr className={styles.Dash} role="presentation" />
    </div>
  );
};

const Actions = ({ actions, date, empty }) => {
  const title = date ? `Recommendations – ${formatDate(date)}` : `Recommendations`;

  return (
    <>
      <ChartHeader title={title} />
      {!empty && (
        <Panel.LEGACY.Section>
          {actions.map((props, i) => (
            <Action key={i} {...props} />
          ))}
        </Panel.LEGACY.Section>
      )}
      {empty && <Empty minHeight="100px" message="No actions to display at this time." />}
    </>
  );
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['good', 'bad', 'warning']),
      content: PropTypes.node,
      link: PropTypes.string,
    }),
  ),
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

export default Actions;
