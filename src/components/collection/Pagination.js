import React from 'react';
import { Box, Pagination } from 'src/components/matchbox';
import styles from './Pagination.module.scss';
import { DEFAULT_PER_PAGE_BUTTONS, DEFAULT_PAGE_RANGE } from 'src/constants';
import PerPageButtons from './PerPageButtons';
import SaveCSVButton from './SaveCSVButton';
import { useHibana } from 'src/context/HibanaContext';

const CollectionPagination = ({
  currentPage,
  data,
  onPageChange,
  onPerPageChange,
  pageRange,
  perPage,
  perPageButtons,
  saveCsv,
}) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  const renderPageButtons = () => {
    if (data.length <= perPage) {
      return null;
    }

    return (
      <Pagination
        pages={Math.ceil(data.length / perPage)}
        pageRange={pageRange}
        currentPage={currentPage}
        onChange={onPageChange}
      />
    );
  };

  if (!currentPage) {
    return null;
  }

  if (!isHibanaEnabled) {
    return (
      <div>
        <div className={styles.PageButtons}>{renderPageButtons()}</div>
        <div className={styles.PerPageButtons}>
          <PerPageButtons
            totalCount={data.length}
            data={data}
            perPage={perPage}
            perPageButtons={perPageButtons}
            onPerPageChange={onPerPageChange}
          />
          <SaveCSVButton data={data} saveCsv={saveCsv} />
        </div>
      </div>
    );
  }

  return (
    <Box display="flex" justifyContent="space-between">
      <Box>{renderPageButtons()}</Box>
      <Box display="flex" alignItems="center">
        <PerPageButtons
          totalCount={data.length}
          data={data}
          perPage={perPage}
          perPageButtons={perPageButtons}
          onPerPageChange={onPerPageChange}
        />
        <SaveCSVButton size="small" outline data={data} saveCsv={saveCsv} />
      </Box>
    </Box>
  );
};

CollectionPagination.defaultProps = {
  pageRange: DEFAULT_PAGE_RANGE,
  perPageButtons: DEFAULT_PER_PAGE_BUTTONS,
  saveCsv: true,
};

export default CollectionPagination;
