import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowsAltOutlined } from "@ant-design/icons";

const Overview = () => {
	return (
		<Button type="default" style={{margin: "10px 10px"}}>
			<ArrowsAltOutlined />
			<Link to="/overview" style={{margin: "inherit", color:"darkslategray"}}>SLO Overview</Link>
		</Button>
	);
};

export default Overview;
