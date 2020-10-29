import { Box, Button, Text } from 'src/components/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';
import React from 'react';
import { ScreenReaderOnly } from 'src/components/matchbox';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import { useHibana } from 'src/context/HibanaContext';

const PerPageButtons = ({
  perPage,
  perPageButtons = DEFAULT_PER_PAGE_BUTTONS,
  onPerPageChange,
  totalCount,
}) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (totalCount <= Math.min(...perPageButtons)) {
    return null;
  }

  if (!isHibanaEnabled) {
    return (
      <Button.Group>
        <span className={styles.PerPageText}>Per Page</span>
        {perPageButtons.map(buttonAmount => (
          <Button
            className={classnames(perPage === buttonAmount && styles.Selected)}
            key={buttonAmount}
            name="collection-per-page-button"
            onClick={() => onPerPageChange(buttonAmount)}
          >
            {buttonAmount}
            <ScreenReaderOnly>per page</ScreenReaderOnly>
          </Button>
        ))}
      </Button.Group>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      <Text display="inline-block" as="span" fontSize="200" marginRight="200">
        Per Page
      </Text>
      <Box marginRight="200">
        <Button.Group>
          {perPageButtons.map(buttonAmount => (
            <Button
              color={perPage === buttonAmount ? 'blue' : undefined}
              flat={perPage !== buttonAmount}
              key={buttonAmount}
              name="collection-per-page-button"
              onClick={() => onPerPageChange(buttonAmount)}
              size="small"
              marginX="100"
              width={[0]}
            >
              {buttonAmount}
              <ScreenReaderOnly>per page</ScreenReaderOnly>
            </Button>
          ))}
        </Button.Group>
      </Box>
    </Box>
  );
};

export default PerPageButtons;
