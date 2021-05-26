import { useEffect, useState } from 'react';
import {
  IErrorBudget,
  IIncident,
  IIncidentSummary,
} from '../interfaces/IIncident';

const useCalculateSLIs = (incidentList: IIncident[]) => {
  const [incidentSummary, setIncidentSummary] = useState<IIncidentSummary[]>(
    []
  );
  const [errBudgetOverTime, setErrBudgetOverTime] = useState<IErrorBudget[]>(
    []
  );
  const [falsePositives, setFalsePositives] = useState<number>(0);
  const [past30Days, setPast30Days] = useState<number>(0);

  useEffect(() => {
    // Format the incidentList data in incidentSummaryType format for the Pie Chat
    let incidentSummaryArr: IIncidentSummary[] = [];
    let errBudgetArr: IErrorBudget[] = [];
    let falsePositivesCount = 0;
    let past30DaysConsumptions = 0;
    const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));

    let i = 0;

    while (i < incidentList.length) {
      let sliNameFound = 0,
        j = 0,
        downtimeDateFound = 0;

      // Skip if incident marked as false positive
      if (incidentList[i]['mark_false_positive'] === true) {
        i++;
        falsePositivesCount++;
        continue;
      }

      for (j = 0; j < incidentSummaryArr.length; j++) {
        // If sli_name key already exist in incidentSummaryArr then update err_budget_spent value
        if (incidentList[i]['sli_name'] === incidentSummaryArr[j]['id']) {
          incidentSummaryArr[j]['value'] += incidentList[i]['err_budget_spent'];
          sliNameFound = 1;
        }
      }

      for (j = 0; j < errBudgetArr.length; j++) {
        // If date key already exist in errBudgetArr then update err_budget_spent value
        if (
          incidentList[i]['created_at'].toString().split('T', 1)[0] ===
          errBudgetArr[j]['x']
        ) {
          errBudgetArr[j]['y'] += incidentList[i]['err_budget_spent'];
          downtimeDateFound = 1;
        }
      }

      // If sli_name key doesn't exist in incidentSummaryArr then add new item
      if (sliNameFound === 0) {
        incidentSummaryArr.push({
          id: incidentList[i]['sli_name'],
          label: incidentList[i]['sli_name'],
          value: incidentList[i]['err_budget_spent'],
        });
      }

      // If sli_name key doesn't exist in incidentSummaryArr then add new item
      if (downtimeDateFound === 0) {
        errBudgetArr.push({
          x: incidentList[i]['created_at'].toString().split('T', 1)[0],
          y: incidentList[i]['err_budget_spent'],
        });
      }

      // Add error budget if with 30 days
      const incidentDate = new Date(incidentList[i].created_at);
      if (incidentDate >= last30Days) {
        past30DaysConsumptions += incidentList[i].err_budget_spent;
      }

      i++;
    }

    setFalsePositives(falsePositivesCount);
    setIncidentSummary(incidentSummaryArr);
    setPast30Days(past30DaysConsumptions);

    let totalErrBudget = 0,
      j = 0;
    for (j = errBudgetArr.length - 1; j >= 0; j--) {
      totalErrBudget += errBudgetArr[j]['y'];
      errBudgetArr[j]['y'] = totalErrBudget;
    }

    setErrBudgetOverTime(errBudgetArr);
  }, [incidentList]);

  return {
    incidentSummary,
    errBudgetOverTime,
    falsePositives,
    past30Days,
  };
};

export default useCalculateSLIs;
