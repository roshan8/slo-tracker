import { Col, Row } from 'antd';
import React from 'react';
import { ISLO } from '../../../../core/interfaces/ISLO';
import { SLOCards } from './helpers';

import './cards.css';

interface IProps {
  SLO: ISLO;
}

const Cards: React.FC<IProps> = ({ SLO }) => {
  return (
    <Row justify="space-between" className="SLO__cards_container">
      {SLOCards.map((card) => (
        <Col lg={4} className="SLO__cards_card">
          <h1>{card.title}</h1>
          <div className="SLO__cards_card_content">{card.render(SLO)}</div>
        </Col>
      ))}
    </Row>
  );
};

export default Cards;
