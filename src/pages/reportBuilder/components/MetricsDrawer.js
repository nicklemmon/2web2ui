import React, { useState, useEffect, useCallback } from 'react';
import { Button, Box, Inline, Checkbox, Tooltip, Drawer } from 'src/components/matchbox';

import { categorizedMetricsList, list } from 'src/config/metrics';
import _ from 'lodash';

const INITIAL_STATE = list.reduce((accumulator, { key }) => {
  accumulator[key] = false;
  return accumulator;
}, {});

export default function MetricsDrawer(props) {
  const getStateFromProps = useCallback(() => {
    return props.selectedMetrics.reduce(
      (accumulator, current) => {
        accumulator[current.key] = true;
        return accumulator;
      },
      { ...INITIAL_STATE },
    );
  }, [props.selectedMetrics]);

  const [selectedMetrics, setSelectedMetrics] = useState(getStateFromProps());
  const [inboxRate, setInboxRate] = useState(false);

  useEffect(() => {
    const newSelectedMetrics = getStateFromProps();
    setSelectedMetrics(newSelectedMetrics);
  }, [getStateFromProps, props.selectedMetrics]);

  const handleCheckbox = key => {
    const newSelectedMetric = { ...selectedMetrics };
    newSelectedMetric[key] = !newSelectedMetric[key];
    setSelectedMetrics(newSelectedMetric);
  };

  const handleApply = () => {
    props.handleSubmit({ metrics: getSelectedMetrics(), inboxRate });
  };

  const getSelectedMetrics = () => _.keys(selectedMetrics).filter(key => !!selectedMetrics[key]);

  const renderMetricsCategories = () => {
    return categorizedMetricsList.map(({ category, metrics }) => {
      return (
        <div key={category}>
          <Box fontWeight="semibold" marginTop="600" marginBottom="400" paddingLeft="100">
            {category}
          </Box>
          <Inline space="100">{renderMetrics(metrics)}</Inline>
        </div>
      );
    });
  };
  const renderMetrics = metrics =>
    metrics.map(metric => {
      return (
        <div key={metric.key}>
          <Tooltip id={metric.key} content={metric.description} portalID="tooltip-portal">
            <Box marginRight="300" width="200px" paddingLeft="100">
              <Checkbox
                id={metric.key}
                onChange={() => handleCheckbox(metric.key)}
                checked={selectedMetrics[metric.key]}
                label={metric.label}
              />
            </Box>
          </Tooltip>
        </div>
      );
    });

  const isSelectedMetricsSameAsCurrentlyAppliedMetrics =
    props.selectedMetrics
      .map(({ key }) => key)
      .sort()
      .join(',') ===
    getSelectedMetrics()
      .sort()
      .join(',');

  //Needs this for current tests as hibana is not enabled for tests but is required for the Drawer component
  const { DrawerFooter = Drawer.Footer } = props;
  return (
    <>
      <Box margin="400" paddingBottom="100px">
        {renderMetricsCategories()}
        <div>
          <Box fontWeight="semibold" marginTop="600" marginBottom="400" paddingLeft="100">
            Deliverability
          </Box>
          <Inline space="100">
            <div>
              <Box marginRight="300" width="200px" paddingLeft="100">
                <Checkbox
                  id="id-checkbox-inbox-rate"
                  onChange={() => setInboxRate(!inboxRate)}
                  checked={inboxRate}
                  label="Inbox Rate"
                />
              </Box>
            </div>
          </Inline>
        </div>
      </Box>
      <DrawerFooter margin="400">
        <Box display="flex">
          <Box pr="100" flex="1">
            <Button
              width="100%"
              onClick={handleApply}
              variant="primary"
              disabled={getSelectedMetrics().length < 1}
            >
              Apply Metrics
            </Button>
          </Box>
          <Box pl="100" flex="1">
            <Button
              width="100%"
              onClick={() => setSelectedMetrics(INITIAL_STATE)}
              variant="secondary"
            >
              Clear Metrics
            </Button>
          </Box>
        </Box>
      </DrawerFooter>
    </>
  );
}
