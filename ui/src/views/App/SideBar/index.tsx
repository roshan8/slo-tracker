import React from 'react';
import { Menu } from 'antd';

import './sidebar.css';

const SideBar = () => {
  const slos = [
    'Add to Cart',
    'Browse Products',
    'Credit Card Payments',
    'Error Budgets',
  ];

  return (
    <div>
      <Menu>
        {slos.map((slo, i) => (
          <Menu.Item key={i}>{slo}</Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default SideBar;
