import { Table } from 'antd';
import React from 'react';
import { Link } from "react-router-dom";

import useGetAllSLOs from '../../../core/hooks/useGetAllSLOs';
import useCalculateSLIs from '../../../core/hooks/useCalculateSLIs';
import { ISLO } from '../../../core/interfaces/ISLO';
import useGetSLIs from '../../../core/hooks/useGetSLIs';

const tableColumns = () => [
    {
        title: 'SLO',
        dataIndex: 'slo_name',
        key: 'slo_name',
    },
    {
        title: 'Target',
        dataIndex: 'target_slo',
        key: 'target_slo',
    },
    {
        title: 'Your SLO',
        render: (o: ISLO) => {
            if(o.current_slo === 0)
                return <div>100</div>
            return <div>{o.current_slo}</div>
        }
    },
    {
        title: '30 days consumption (mins)',
        render: (o: ISLO) => {
            const Past30DaysConsumption = () => {
                const { SLIs }= useGetSLIs(o);
                const { past30Days } = useCalculateSLIs(SLIs);
                return past30Days;
            }
            return <div>{Past30DaysConsumption()}</div>
        },
    },
    {
        title: 'Remaining Error Budget (mins)',
        dataIndex: 'remaining_err_budget',
        key: 'remaining_err_budget',
    },
    {
        title: 'SLO Burning Rate',
        render: (o: ISLO) => {
            const totalSecsInYear = 31536000;
            const downtimeInFraction = 1 - o.target_slo / 100;
            const allottedErrBudgetInMin =
                (downtimeInFraction * totalSecsInYear) / 60;

            const month_raw = new Date().getMonth() + 1;

            const errBudgetSpent = allottedErrBudgetInMin - o.remaining_err_budget;
            const errBudgetAllowed = (allottedErrBudgetInMin / 12) * month_raw;

            let content = 'Healthy';
            let color = '#50aa02';

            if (errBudgetSpent > errBudgetAllowed) {
                content = 'Critical';
                color = '#cf1322';
            }

            return <div style={{ color }}>{content}</div>;
        },

    },
    {
        title: 'Incidents Reported',
        render: (o: ISLO) => {
            const GetIncidentCount = () => {
                const { SLIs }= useGetSLIs(o);
                return SLIs.length;
            }

            return <div>{GetIncidentCount()}</div>
        }
    },
    {
        title: 'View Incidents',
        key: 'View Incidents',
        render: (o: ISLO) => {
            
            return <Link to="/">View Incidents</Link>
        },
    },
    
];

const SLOTable: React.FC = () => {
    const { SLOs } = useGetAllSLOs();
    const tableData = SLOs.map((i) => ({
        key: i.id,
        ...i,
    }));

    return (
        <>
            <div style={{fontSize: 20, fontWeight: 500, margin: "20px 1em"}}>Overview</div>
            <Table dataSource={tableData}
            columns={tableColumns()}
            pagination={{ pageSize: 5}} size="middle" style={{width: "auto", margin: "0 2em"}}/>
        </>
    );
}

export default SLOTable;