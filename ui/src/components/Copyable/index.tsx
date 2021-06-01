import { Button, Row } from 'antd';
import React, { useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { blue, green } from '@ant-design/colors';

import './copyable.css';

interface IProps {
  content: string;
}

const Copyable: React.FC<IProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (_) {
      const textArea = document.createElement('textarea');
      textArea.value = content;

      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      document.execCommand('copy');

      document.body.removeChild(textArea);
    } finally {
      setCopied(true);
    }

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Row className="copyable__container">
      <input className="copyable__content" value={content} />
      <Button type="text" onClick={onCopy} style={{ fontWeight: 500 }}>
        {copied ? (
          <CheckOutlined style={{ color: green.primary }} />
        ) : (
          <CopyOutlined style={{ color: blue.primary }} />
        )}
      </Button>
    </Row>
  );
};

export default Copyable;
