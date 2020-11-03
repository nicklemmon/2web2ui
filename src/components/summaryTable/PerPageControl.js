/***
 * DEPRECATED! Use src/components/collection/Pagination.js instead (also update this when a deprecation plan is in place)
 */
import React from 'react';
import classnames from 'classnames';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { Box, Button } from 'src/components/matchbox';
import styles from './SummaryTable.module.scss';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';

function OGPerPageControl({ onChange, perPage, totalCount }) {
  if (!totalCount || totalCount < DEFAULT_PER_PAGE_BUTTONS[0]) {
    return null;
  }

  return (
    <div className={styles.PerPageGroup}>
      <Button.Group>
        <span className={styles.PerPageLabel}>Per Page</span>
        {DEFAULT_PER_PAGE_BUTTONS.map(size => (
          <Button
            flat
            className={classnames(perPage === size && styles.Selected)}
            key={size}
            onClick={() => onChange(size)}
          >
            {size}
          </Button>
        ))}
      </Button.Group>
    </div>
  );
}

function HibanaPerPageControl({ onChange, perPage, totalCount }) {
  if (!totalCount || totalCount < DEFAULT_PER_PAGE_BUTTONS[0]) {
    return null;
  }

  return (
    <Box p="200">
      <Button.Group>
        <Box as="span">Per Page</Box>

        {DEFAULT_PER_PAGE_BUTTONS.map(size => {
          const isActive = perPage === size;

          return (
            <Button
              variant={isActive ? 'primary' : 'tertiary'}
              aria-selected={isActive ? 'true' : 'false'}
              key={size}
              onClick={() => onChange(size)}
              ml="200"
              size="small"
              marginX="100"
              width={[0]}
            >
              {size}
            </Button>
          );
        })}
      </Button.Group>
    </Box>
  );
}

export default function PerPageControl(props) {
  return useHibanaToggle(OGPerPageControl, HibanaPerPageControl)(props);
}
