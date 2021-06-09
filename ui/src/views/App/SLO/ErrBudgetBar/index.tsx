import React from "react";
import { Popover } from "antd";
import { IIncidentSummary } from "../../../../core/interfaces/IIncident";

import "./errBudgetBar.css";

interface IProps {
	data: IIncidentSummary[];
}



const ErrBudgetBar: React.FC<IProps> = ({ data }) => {
	const progBar = (() => {
		let sum = 0;
		data.forEach((x) => {
			sum += x.value;
		});
		let prog = data.map((val, i) => {
			const w = (val.value / sum) * 100;
			const randColor = Math.floor(Math.random() * 16777215).toString(16);
			const legend = (
				<div>
					<span
						className="dot"
						style={{ color: "#" + randColor, marginRight: "10px" }}
					>
						●
					</span>
					<span
						className="label"
						style={{ marginRight: "10px", marginBottom: "10px" }}
					>
						{val.label}
					</span>
					<span className="perc">{w.toFixed(2)}%</span>
				</div>
			);
			return (
				<Popover content={legend}>
					<div
						className="bar"
						style={{ width: w + "%", backgroundColor: "#" + randColor }}
						key={i}
					></div>
				</Popover>
			);
		});

		return (
			<div className="multi-progress-bar">
				<div className="bars">{prog}</div>
			</div>
		);
	})();

	return (
		<div>
			{data.length ? (
				progBar
			) : (
				<div
					style={{
						textAlign: "center",
						fontWeight: 500,
						fontSize: "24px",
					}}
				>
					Not Enough Data
				</div>
			)}
		</div>
	);
};

export default ErrBudgetBar;
