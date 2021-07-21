import { Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import useGetAllSLOs from "../../../core/hooks/useGetAllSLOs";
import useCalculateSLIs from "../../../core/hooks/useCalculateSLIs";
import { ISLO } from "../../../core/interfaces/ISLO";
import useGetSLIs from "../../../core/hooks/useGetSLIs";

interface IProps {
	setActiveSLO: (activeSLO: ISLO) => void;
}

const tableColumns = (props) => [
	{
		title: "SLO",
		key: "slo_name",
		render: (o: ISLO) => (
			<Link
				to="/"
				onClick={() => {
					props.setActiveSLO(o);
				}}
				style={{ color: "#0f0f0f" }}
			>
				{o.slo_name}
			</Link>
		),
	},
	{
		title: "Target",
		dataIndex: "target_slo",
		key: "target_slo",
	},
	{
		title: "Your SLO",
		render: (o: ISLO) => (o.current_slo === 0 ? 100 : o.current_slo),
	},
	{
		title: "30 days consumption (mins)",
		render: (o: ISLO) => {
			const Past30DaysConsumption = () => {
				const { SLIs } = useGetSLIs(o);
				const { past30Days } = useCalculateSLIs(SLIs);
				return past30Days;
			};
			return <div>{Past30DaysConsumption()}</div>;
		},
	},
	{
		title: "Remaining Error Budget (mins)",
		dataIndex: "remaining_err_budget",
		key: "remaining_err_budget",
	},
	{
		title: "SLO Burning Rate",
		render: (o: ISLO) => {
			const totalSecsInYear = 31536000;
			const downtimeInFraction = 1 - o.target_slo / 100;
			const allottedErrBudgetInMin =
				(downtimeInFraction * totalSecsInYear) / 60;

			const month_raw = new Date().getMonth() + 1;

			const errBudgetSpent = allottedErrBudgetInMin - o.remaining_err_budget;
			const errBudgetAllowed = (allottedErrBudgetInMin / 12) * month_raw;

			let content = "Healthy";
			let color = "#50aa02";

			if (errBudgetSpent > errBudgetAllowed) {
				content = "Critical";
				color = "#cf1322";
			}

			return <div style={{ color }}>{content}</div>;
		},
	},
	{
		title: "Incidents Reported",
		render: (o: ISLO) => {
			const GetIncidentCount = () => {
				const { SLIs } = useGetSLIs(o);
				return SLIs.length;
			};

			return <div>{GetIncidentCount()}</div>;
		},
	},
	{
		title: "Updated on",
		render: (o: ISLO) => {
			const created = new Date(o.updated_at);
			return `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}, ${created.getHours()}:${created.getMinutes()}:${created.getSeconds()}`;
		},
	},
	{
		title: "View Incidents",
		key: "View Incidents",
		render: (o: ISLO) => (
			<Link
				to="/"
				onClick={() => {
					props.setActiveSLO(o);
				}}
			>
				View Incidents
			</Link>
		),
	},
];

const SLOTable: React.FC<IProps> = ({ ...props }) => {
	const { SLOs } = useGetAllSLOs();
	const tableData = SLOs.map((i) => ({
		key: i.id,
		...i,
	}));
	return (
		<>
			<div style={{ fontSize: 20, fontWeight: 300, margin: "20px 0" }}>
				<Link to="/" style={{ marginLeft: "1em" }}>
					SLO Tracker
				</Link>
				{" / Overview"}
			</div>
			<Table
				dataSource={tableData}
				columns={tableColumns(props)}
				pagination={{ pageSize: 15 }}
				size="middle"
				style={{ width: "auto", margin: "0 2em" }}
			/>
		</>
	);
};

export default SLOTable;
