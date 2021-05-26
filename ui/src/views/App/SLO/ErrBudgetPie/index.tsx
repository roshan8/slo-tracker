import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { IIncidentSummary } from '../../../../core/interfaces/IIncident';

interface IProps {
  data: IIncidentSummary[];
}

const ErrBudgetPie: React.FC<IProps> = ({ data }) => {
  return (
    <div style={{ height: '28em', background: '#ffffff', borderRadius: '4px' }}>
      {data.length ? (
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[]}
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

export default ErrBudgetPie;
