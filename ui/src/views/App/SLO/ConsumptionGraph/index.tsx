import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { IErrorBudget } from '../../../../core/interfaces/IIncident';

interface IProps {
  data: IErrorBudget[];
}

const ConsumptionGraph: React.FC<IProps> = ({ data }) => {
  return (
    <div style={{ height: '28em', background: '#ffffff', borderRadius: '4px' }}>
      {data.length ? (
        <ResponsiveLine
          data={[
            {
              data,
              id: 'ErrBudget',
            },
          ]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            stacked: false,
          }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Error budget spent',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          axisBottom={{
            tickValues: 'every day',
            format: '%b %d',
            legendOffset: -12,
          }}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        <div
          style={{
            textAlign: 'center',
            paddingTop: '9rem',
            fontWeight: 500,
            fontSize: '24px',
          }}
        >
          Not Enough Data
        </div>
      )}
    </div>
  );
};

export default ConsumptionGraph;
