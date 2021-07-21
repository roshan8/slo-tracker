import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
	onAddSLO: () => void;
}

const TopBar: React.FC<IProps> = (props) => {
	return (
		<Button type="dashed" icon={<PlusOutlined/>} onClick={props.onAddSLO}>
			Create SLO
		</Button>
	);
};

export default TopBar;
