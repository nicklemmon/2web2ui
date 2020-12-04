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
import ChartTooltip from './TooltipCollapsed';
import styled from 'styled-components';

const height = 350;
const verticalMargin = 60;
const horizontalMargin = 60;

const StyledBar = styled(Bar)`
  transition: 0.15s;
`;

function Collapsed(props) {
  const { data, filters, parentWidth } = props;
  const { dimension } = filters;

  // Dimensions
  const width = parentWidth || 600;
  const xMax = width - horizontalMargin;
  const yMax = height - verticalMargin;

  // Accessors
  const x = d => new Date(d.date * 1000);
  const yD = d => d[`${dimension}_1_day`];
  const yW = d => d[`${dimension}_7_day`];
  const yM = d => d[`${dimension}_30_day`];
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

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, yM)],
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
        day: yD(d),
        week: yW(d),
        month: yM(d),
      },
    });
  };

  return (
    <>
      <>
        <svg width={width} height={height}>
          <Group left={horizontalMargin} top={20}>
            <GridRows scale={yScale} width={width} stroke={tokens.color_gray_400} numTicks={6} />
            <AreaClosed
              data={data}
              x={d => xScale(x(d))}
              y={d => yScale(yM(d))}
              yScale={yScale}
              strokeWidth={1}
              stroke="#78b6ff"
              fill="rgba(171, 210, 255, 0.4)" // blue 400
              curve={curveMonotoneX}
            />
            <AreaClosed
              data={data}
              x={d => xScale(x(d))}
              y={d => yScale(yW(d))}
              yScale={yScale}
              strokeWidth={1}
              stroke="#78b6ff"
              fill="rgba(171, 210, 255, 0.5)" // blue 400
              curve={curveMonotoneX}
            />
            <AreaClosed
              data={data}
              x={d => xScale(x(d))}
              y={d => yScale(yD(d))}
              yScale={yScale}
              strokeWidth={1}
              stroke="#78b6ff"
              fill="rgba(171, 210, 255, 0.6)" // rgb(141, 235, 203)
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
            scale={yScale}
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
    </>
  );
}

export default withParentSize(Collapsed);
