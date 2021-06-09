import React from "react";
import { Popover } from "antd";
import { IIncident, IIncidentSummary } from "../../../../core/interfaces/IIncident";

import "./errBudgetBar.css";
interface IProps {
	data: IIncidentSummary[];
	sli: IIncident[];
}


const ErrBudgetBar: React.FC<IProps> = ({ data, sli}) => {
	let sum = 0, k: number;
	let counts = {};
	let colors = {};
	for(k=0; k< 50; k++){
		colors[k] = `hsla(${k * 36}, 100%, 50%, 1)`;
	}
	data.forEach((x) => {
		sum += x.value;
	});
	sli.forEach((i) => {
		if(!i.mark_false_positive)
			counts[i.sli_name] = (counts[i.sli_name] || 0) + 1;
	});

	const legend = data.map((val, i) => {
		return (
			<>
				<span className="dot" style={{ color: colors[i], fontSize: 25, marginLeft: "10px" , marginRight: "5px"}}>
					●
				</span>
				<span className="label" style={{marginRight: "10px"}}>
					{val.label}
				</span>
			</>
		)
	})

	const prog = data.map((val, i) => {
		const w = (val.value / sum) * 100;
		const popoverContent = (
			<>
				<span className="dot" style={{ color: colors[i], fontSize: 25, marginLeft: "10px" , marginRight: "5px"}}>
					●
				</span>
				<span className="label" style={{marginRight: "10px"}}>
					{val.label}
				</span>
				<div className="perc" style={{fontWeight: 500}}>
					{w.toFixed(2)}%
				</div>
				<div>
					{(counts[val.label]>1?`(${counts[val.label]} incidents)`:`(${counts[val.label]} incident)`)}
				</div>
			</>
		);
		return (
			<Popover content={popoverContent}>
				<div
					className="bar"
					style={{ width: w + "%", backgroundColor: colors[i] }}
					key={i}
				></div>
			</Popover>
		);
	});
		
	const progBar = (() => {
		return (
			<div className="multi-progress-bar">
				<div style={{fontWeight: 500, marginBottom: "20px"}}>Error Budget Consumption by SLIs</div>
				<div className="bars">{prog}</div>
				<div style={{marginLeft: "10px", marginTop: "10px",}}>
					{legend}
				</div>
			</div>
		);
	})();

	return (
		<div>
			{progBar}
		</div>
	);
};

export default ErrBudgetBar;
