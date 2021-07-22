import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowsAltOutlined } from "@ant-design/icons";

const Overview = () => {
	return (
		<Button size="large" type="primary" style={{margin: "10px 10px"}}>
			<Link to="/overview">
				<ArrowsAltOutlined style={{marginRight: "10px"}}/>
				SLO Overview
			</Link>
		</Button>
	);
};

export default Overview;
