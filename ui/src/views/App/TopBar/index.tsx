import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
	onAddSLO: () => void;
}

const TopBar: React.FC<IProps> = (props) => {
	return (
		// <Col>
		// 	<Row>
				// <div style={{ lineHeight: "30px" }}>
					<Button type="dashed" icon={<PlusOutlined/>} onClick={props.onAddSLO}>
						Create SLO
					</Button>
				// </div>
		// 	</Row>
		// </Col>
	);
};

export default TopBar;
