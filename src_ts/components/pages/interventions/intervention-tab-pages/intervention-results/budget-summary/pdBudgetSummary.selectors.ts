import {createSelector} from 'reselect';
import {PlannedBudget} from '../../common/models/intervention-types';
import {PdBudgetSummary} from './pdBudgetSummary.models';
import {currentInterventionPlannedBudget} from '../../common/selectors';

// @lajos TO DO: check exactly where the values come from

export const selectPdBudgetSummary = createSelector(
  currentInterventionPlannedBudget,
  (plannedBudget: PlannedBudget) => {
    return new PdBudgetSummary(plannedBudget);
  }
);
