import { Col, Row } from 'antd';
import React from 'react';
import { ISLO } from '../../../../core/interfaces/ISLO';
import { SLOCards } from './helpers';

import './cards.css';

export interface ICardData {
  SLO: ISLO;
  falsePositives: number;
  past30Days: number;
}

interface IProps {
  data: ICardData;
}

const Cards: React.FC<IProps> = ({ data }) => {
  return (
    <Row justify="space-between" className="SLO__cards_container">
      {SLOCards.map((card, idx) => (
        <Col
          className="SLO__cards_card"
          key={card.title}
          style={{
            marginLeft: idx === 0 ? '0px' : '6px',
            marginRight: idx === SLOCards.length - 1 ? '0px' : '6px',
          }}
        >
          <h1>{card.title}</h1>
          <div className="SLO__cards_card_content">{card.render(data)}</div>
        </Col>
      ))}
    </Row>
  );
};

export default Cards;
