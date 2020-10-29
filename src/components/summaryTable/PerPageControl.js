import React from 'react';
import classnames from 'classnames';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { Box, Button } from 'src/components/matchbox';
import styles from './SummaryTable.module.scss';

const SIZES = [10, 25, 50, 100];

function OGPerPageControl({ onChange, perPage, totalCount }) {
  if (!totalCount || totalCount < SIZES[0]) {
    return null;
  }

  return (
    <div className={styles.PerPageGroup}>
      <Button.Group>
        <span className={styles.PerPageLabel}>Per Page</span>
        {SIZES.map(size => (
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
  if (!totalCount || totalCount < SIZES[0]) {
    return null;
  }

  return (
    <Box p="200">
      <Button.Group>
        <Box as="span">Per Page</Box>

        {SIZES.map(size => {
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
