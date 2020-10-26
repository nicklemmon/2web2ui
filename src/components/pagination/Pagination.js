import React from 'react';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { Pagination } from 'src/components/matchbox';

// TODO: Figure out what the real difference is between PerPageControl and PerPageButtons
import PerPageControl from './PerPageControl';
import PerPageButtons from 'src/components/collection/PerPageButtons';

import OGPaginationStyles from './Pagination.module.scss';
import PaginationHibanaStyles from './PaginationHibana.module.scss';

const perPageComponents = ['control', 'buttons'];
const whichButtonComponentToUse = perPageComponents[0];

// TODO: probably revert this change ....
function CommonPagination({
  styles,
  currentPage,
  pageRange,
  pages,
  perPage,
  totalCount,
  handlePagination,
  handlePerPageChange,
}) {
  return (
    <div className={styles.PaginationWrapper}>
      <div className={styles.PageButtons}>
        <Pagination
          currentPage={currentPage}
          pageRange={pageRange}
          pages={pages}
          onChange={handlePagination}
          flat
          className={styles.Pagination}
        />
      </div>
      <div>
        {whichButtonComponentToUse === 'control' && (
          <PerPageControl
            onChange={handlePerPageChange}
            perPage={perPage}
            totalCount={totalCount}
          />
        )}
        {whichButtonComponentToUse === 'buttons' && (
          <PerPageButtons
            onChange={handlePerPageChange}
            perPage={perPage}
            totalCount={totalCount}
          />
        )}
      </div>
    </div>
  );
}

export function CommonPaginationWrapper(props) {
  const styles = useHibanaOverride(OGPaginationStyles, PaginationHibanaStyles);
  return <CommonPagination styles={styles} {...props} />;
}
