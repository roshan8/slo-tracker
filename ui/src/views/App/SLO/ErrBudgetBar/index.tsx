import React from "react";
import { Popover } from "antd";
import { IIncident, IIncidentSummary } from "../../../../core/interfaces/IIncident";

import "./errBudgetBar.css";
interface IProps {
	data: IIncidentSummary[];
	sli: IIncident[];
}


const ErrBudgetBar: React.FC<IProps> = ({ data, sli}) => {
	let sum = 0;
	let counts = {};
	data.forEach((x) => {
		sum += x.value;
	});
	sli.forEach((i) => {
		if(!i.mark_false_positive)
			counts[i.sli_name] = (counts[i.sli_name] || 0) + 1;
	});

	const prog = data.map((val, i) => {
		const w = (val.value / sum) * 100;
		const randColor = Math.floor(Math.random() * 16777215).toString(16);
		const legend = (
			<div>
				<span className="label" style={{ marginRight: "10px" }}>
					{val.label}
				</span>
				<span className="dot" style={{ color: "#" + randColor, fontSize: 25 }}>
					●
				</span>
				<div className="perc" style={{fontWeight: 500}}>
					{w.toFixed(2)}%
				</div>
				<div>
					{(counts[val.label]>1?`(${counts[val.label]} incidents)`:'')}
				</div>
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
		
	const progBar = (() => {
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
