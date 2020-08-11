import {createSelector} from 'reselect';
import {PlannedBudget, Intervention} from '../../common/models/intervention.types';
import {BudgetSummary, InterventionData} from './budgetSummary.models';
import {currentInterventionPlannedBudget, currentIntervention} from '../../common/selectors';

// @lajos TO DO: check exactly where the values come from

export const selectBudgetSummary = createSelector(currentInterventionPlannedBudget, (plannedBudget: PlannedBudget) => {
  return new BudgetSummary(plannedBudget);
});

export const selectInterventionData = createSelector(currentIntervention, (intervention: Intervention) => {
  return new InterventionData(intervention);
});
