import React from 'react';
import { Box } from '@sparkpost/matchbox-hibana';
import { AreaClosed, Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { max, extent, bisector } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { withParentSize } from '@visx/responsive';
import { useTooltip, Tooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import ChartTooltip from './Tooltip';
import styled from 'styled-components';

const StyledBar = styled(Bar)`
  transition: 0.15s;
`;

const height = 350;
const verticalMargin = 60;
const horizontalMargin = 60;

function Area(props) {
  const { data, filters, parentWidth } = props;
  const { dimension, precision } = filters;

  // Dimensions
  const width = parentWidth || 600;
  const xMax = width - horizontalMargin;
  const yMax = height - verticalMargin;

  // Accessors
  const x = d => new Date(d.date * 1000);
  const y = d => d[`${dimension}_${precision}_day`];
  const yDelivery = d => Number(d[`delivery_${precision}_day`]);
  const bisectDate = bisector(d => new Date(d.date * 1000)).right;

  // Scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x),
  });

  const xScaleBar = scaleBand({
    range: [0, xMax],
    domain: data.map(x),
    padding: 0,
  });

  const yScaleDelivery = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, yDelivery)],
    nice: true,
  });


  // Tooltip config
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const handleMouseOver = (event, d) => {
    const coords = localPoint(event.target.ownerSVGElement, event) || { x: 0 };

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        date: x(d),
        value: y(d),
        delivery: yDelivery(d),
        precision,
      },
    });
  };

  return (
    <>
      <svg width={width} height={height}>
        <Group left={horizontalMargin} top={20}>
          <GridRows
            scale={yScaleDelivery}
            width={width}
            stroke={tokens.color_gray_400}
            numTicks={6}
          />
          <AreaClosed
            data={data}
            x={d => xScale(x(d))}
            y={d => yScaleDelivery(yDelivery(d))}
            yScale={yScaleDelivery}
            strokeWidth={1}
            stroke="#c5ced6"
            fill="rgba(235, 240, 245, 0.6)" // gray 200
            curve={curveMonotoneX}
          />
          <AreaClosed
            data={data}
            x={d => xScale(x(d))}
            y={d => yScaleDelivery(y(d))}
            yScale={yScaleDelivery}
            strokeWidth={1}
            stroke="#78b6ff"
            fill="rgba(171, 210, 255, 0.6)" // blue 400
            curve={curveMonotoneX}
          />
          {data.map(d => {
            const dt = x(d);
            const barWidth = xScaleBar.bandwidth();
            const barHeight = yMax;
            const barX = xScaleBar(dt);
            const barY = yMax - barHeight;
            const [hovered, setHovered] = React.useState(false);

            return (
              <StyledBar
                key={`bar-${dt}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={hovered ? 'rgba(120,120,120,0.15)' : 'rgba(0,0,0,0)'}
                onMouseOver={e => {
                  handleMouseOver(e, d);
                  setHovered(true);
                }}
                onMouseOut={() => {
                  hideTooltip();
                  setHovered(false);
                }}
              />
            );
          })}
        </Group>
        <AxisBottom
          left={horizontalMargin}
          top={yMax + 20}
          scale={xScale}
          numTicks={14}
          tickStroke={tokens.color_gray_400}
          stroke={tokens.color_gray_400}
          tickLabelProps={() => ({
            fill: tokens.color_gray_700,
            textAnchor: 'middle',
            fontSize: 11,
            fontFamily: 'Calibre',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
        <AxisLeft
          left={horizontalMargin}
          top={20}
          scale={yScaleDelivery}
          numTicks={6}
          tickStroke={tokens.color_gray_400}
          stroke={tokens.color_gray_400}
          tickLabelProps={() => ({
            fill: tokens.color_gray_700,
            textAnchor: 'end',
            fontSize: 11,
            fontFamily: 'Calibre',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
      </svg>
      {tooltipOpen && (
        <Tooltip
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          style={{ top: tooltipTop, left: tooltipLeft, pointerEvents: 'none' }}
        >
          <Box position="absolute" top={tooltipTop} left={tooltipLeft}>
            <ChartTooltip data={tooltipData} />
          </Box>
        </Tooltip>
      )}
    </>
  );
}

export default withParentSize(Area);
