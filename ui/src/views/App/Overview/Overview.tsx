import { Link } from "react-router-dom";
import { Button } from "antd";

const Overview =(() => {
    return (
        <Button type="dashed">
            <Link to="/overview">
                SLO Overview
            </Link>
        </Button>
    )
})

export default Overview;