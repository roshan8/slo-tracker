import { ReactChild } from 'react';
import { ICardData } from '.';

interface ISLOCard {
  title: string;
  render: (data: ICardData) => ReactChild;
}

export const SLOCards: ISLOCard[] = [
  {
    title: 'Target',
    render: ({ SLO }) => <div>{SLO.target_slo}%</div>,
  },
  {
    title: 'Your SLO',
    render: ({ SLO }) => <div>{SLO.current_slo.toFixed(6)}%</div>,
  },
  {
    title: '30 Days Consumption',
    render: ({ past30Days }) => <div>{past30Days.toFixed(3)} min</div>,
  },
  {
    title: 'Remaining Error Budget',
    render: ({ SLO }) => <div>{SLO.remaining_err_budget.toFixed(3)} min</div>,
  },
  {
    title: 'SLO Burning Rate',
    render: ({ SLO: slo }) => {
      const totalSecsInYear = 31536000;
      const downtimeInFraction = 1 - slo.target_slo / 100;
      const allottedErrBudgetInMin =
        (downtimeInFraction * totalSecsInYear) / 60;

      const month_raw = new Date().getMonth() + 1;

      const errBudgetSpent = allottedErrBudgetInMin - slo.remaining_err_budget;
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
    title: 'False Positives',
    render: ({ falsePositives }) => <div>{falsePositives}</div>,
  },
];
