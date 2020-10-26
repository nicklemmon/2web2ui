import React from 'react';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { Pagination } from 'src/components/matchbox';
import PerPageControl from './PerPageControl';
import OGPaginationStyles from './Pagination.module.scss';
import PaginationHibanaStyles from './PaginationHibana.module.scss';

/**
 * CommonPagination
 * ================
 * This component exists to re-use the styles surrounding the Pagination and PerPageControl components
 */
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
        <PerPageControl onChange={handlePerPageChange} perPage={perPage} totalCount={totalCount} />
      </div>
    </div>
  );
}

export function CommonPaginationWrapper(props) {
  const styles = useHibanaOverride(OGPaginationStyles, PaginationHibanaStyles);
  return <CommonPagination styles={styles} {...props} />;
}
