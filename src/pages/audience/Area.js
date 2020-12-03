import React from 'react';
import { AreaClosed, Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear } from '@visx/scale';
import { max, extent, bisector } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';

const width = 600;
const height = 300;
const verticalMargin = 90;

function Area(props) {
  const { data, filters } = props;
  const { dimension, precision } = filters;

  const xMax = width;
  const yMax = height - verticalMargin;

  // Accessors
  const x = d => new Date(d.date);
  const y = d => d[`${dimension}_${precision}_day`];
  const yDelivery = d => d[`delivery_${precision}_day`];

  // Scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x),
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)],
    nice: true,
  });

  const yScaleDelivery = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, yDelivery)],
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      <AreaClosed
        data={data}
        x={d => xScale(x(d))}
        y={d => yScaleDelivery(yDelivery(d))}
        yScale={yScaleDelivery}
        strokeWidth={1}
        stroke="#c5ced6"
        fill="#ebf0f5"
        curve={curveMonotoneX}
      />
      <AreaClosed
        data={data}
        x={d => xScale(x(d))}
        y={d => yScaleDelivery(y(d))}
        yScale={yScaleDelivery}
        strokeWidth={1}
        stroke="#78b6ff"
        fill="rgb(204, 227, 255)"
        curve={curveMonotoneX}
      />

      {/* <Group top={40}>
        {data.map((d, i) => {
          const date = x(d);
          const value = y(d);

          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(y(d));
          const barX = xScale(date);
          const barY = yMax - barHeight;

          console.log(date, value);

          return (
            <rect
              x={barX}
              y={yMax - height}
              width={barWidth}
              height={height}
              fill="blue"
              // fill={getBgFill(d.date)}
              // onClick={event => {
              //   setSelected(d)
              // }}
              style={{
                cursor: 'pointer',
              }}
            />
          );
        })}
      </Group> */}
    </svg>
  );
}

export default Area;
