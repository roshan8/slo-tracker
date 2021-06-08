import React from 'react';
import { IIncidentSummary } from '../../../../core/interfaces/IIncident';

import './errBudgetBar.css'

interface IProps {
	data: IIncidentSummary[];
}

const ErrBudgetBar: React.FC<IProps> = ({ data }) => {

	const progBar = (() => {
		let prog = data.map(function (val, i) {
			const randColor = Math.floor(Math.random()*16777215).toString(16)
			return (
				<div className="bar" style={{ 'width': val.value + '%', 'backgroundColor': '#' + randColor}} key={i}>
					
				</div>
			)
		});

		return (
			<div className="multi-progress-bar">
				<div className="bars">
					{prog}
				</div>
			</div>
		);
	})();

	return (
		<div>
			{data.length ? progBar: (
				<div
					style={{
						textAlign: "center",
						paddingTop: "9rem",
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
