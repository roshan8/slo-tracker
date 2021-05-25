import { ReactChild } from 'react';
import { ISLO } from '../../../../core/interfaces/ISLO';

interface ISLOCard {
  title: string;
  render: (slo: ISLO) => ReactChild;
}

export const SLOCards: ISLOCard[] = [
  {
    title: 'Target',
    render: (slo: ISLO) => <div>{slo.target_slo}%</div>,
  },
  {
    title: 'Your SLO',
    render: (slo: ISLO) => <div>{slo.current_slo}%</div>,
  },
  {
    title: '30 Days Consumption',
    render: (slo: ISLO) => <div>99.99%</div>,
  },
  {
    title: 'Remaining Error Budget',
    render: (slo: ISLO) => <div>{slo.remaining_err_budget} min</div>,
  },
  {
    title: 'SLO Burning Rate',
    render: (slo: ISLO) => {
      const totalSecsInYear = 31536000;
      const downtimeInFraction = 1 - slo.target_slo / 100;
      const allottedErrBudgetInMin =
        (downtimeInFraction * totalSecsInYear) / 60;

      const month_raw = new Date().getMonth() + 1;

      const errBudgetSpent = allottedErrBudgetInMin - slo.remaining_err_budget;
      const errBudgetAllowed = (allottedErrBudgetInMin / 12) * month_raw;

      let content = 'Healthy';
      let color = '#3f8600';

      if (errBudgetSpent > errBudgetAllowed) {
        content = 'Critical';
        color = '#cf1322';
      }

      return <div style={{ color }}>{content}</div>;
    },
  },
];
