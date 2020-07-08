import {createSelector} from 'reselect';
import {PlannedBudget} from '../../common/models/intervention-types';
import {PdResultsOverview} from './PdResultsOverview.models';
import {currentInterventionPlannedBudget} from '../../common/selectors';

export const selectPdResultsOverview = createSelector(
  currentInterventionPlannedBudget,
  (plannedBudget: PlannedBudget) => {
    return new PdResultsOverview(plannedBudget);
  }
);
