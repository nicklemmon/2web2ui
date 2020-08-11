import React from 'react';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from '@sparkpost/matchbox-icons';
import { Box, Tag } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import OGStyles from './LegendItem.module.scss';
import hibanaStyles from './LegendItemHibana.module.scss';

function OGLegendItem(props) {
  const { name, count, fill, children, breadcrumb, onClick, hovered, otherHovered } = props;
  const styles = OGStyles;
  const itemClasses = classNames(
    styles.LegendItem,
    onClick && styles.enabled,
    children && styles.hasChildren,
    breadcrumb && styles.breadcrumb,
    hovered && styles.hovered,
    otherHovered && styles.otherHovered,
  );
  const breadcrumbMarkup = breadcrumb ? <ChevronLeft className={styles.BreadcrumbIcon} /> : null;
  const expandMarkup = children?.length ? <ChevronRight /> : null;

  return (
    <a className={itemClasses} onClick={onClick} title={onClick && `View ${name}`} {...props}>
      {fill && <span className={styles.Color} style={{ backgroundColor: fill }} />}
      {breadcrumbMarkup}
      <span className={styles.Name}>
        {name}
        {expandMarkup}
      </span>
      {count !== undefined && <span className={styles.Count}>{count.toLocaleString()}</span>}
    </a>
  );
}

function HibanaLegendItem(props) {
  const { name, count, fill, children, breadcrumb, onClick, hovered, otherHovered } = props;
  const styles = hibanaStyles;
  const isExpandable = children && children.length;
  const hasBreadcrumb = breadcrumb;
  const hasCount = count !== undefined;

  return (
    <Box
      onClick={onClick}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick && 0}
      display="flex"
      alignItems="center"
      borderRadius="200"
      title={onClick && `View ${name}`}
      className={classNames(
        styles.LegendItem,
        onClick && styles.isClickable,
        hovered && styles.isHovered,
        otherHovered && styles.anotherIsHovered,
      )}
      small
      {...props}
    >
      {hasBreadcrumb && (
        <Box mr="100" display="flex" alignItems="center">
          <ChevronLeft />
        </Box>
      )}

      <Tag>
        {fill && (
          <Box backgroundColor={fill} width="1rem" height="1rem" mr="200" borderRadius="circle" />
        )}

        {name}
      </Tag>

      {hasCount && (
        <Box as="span" ml="200" fontSize="300" fontWeight="200" color="gray.700">
          {count.toLocaleString()}
        </Box>
      )}

      {isExpandable && (
        <Box ml="100" display="flex" alignItems="center">
          <ChevronRight />
        </Box>
      )}
    </Box>
  );
}

LegendItem.displayName = 'PieChart.LegendItem';

export default function LegendItem(props) {
  return useHibanaToggle(OGLegendItem, HibanaLegendItem)(props);
}
