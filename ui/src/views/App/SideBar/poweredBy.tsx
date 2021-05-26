import React from 'react';
import { SquadcastLogo } from '../../../assets';

const PoweredBy: React.FC = () => (
  <a href="https://squadcast.com" target="_blank" rel="noreferrer">
    <div
      style={{
        padding: '4px 14px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{
          lineHeight: '16px',
          color: '#929da6',
          fontWeight: 500,
          fontSize: '13px',
        }}
      >
        Powered by:
      </p>
      <SquadcastLogo height={16} width={90} />
    </div>
  </a>
);

export default PoweredBy;
