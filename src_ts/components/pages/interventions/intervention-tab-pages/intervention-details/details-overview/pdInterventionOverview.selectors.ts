import {createSelector} from 'reselect';
import {Intervention} from '../../common/models/intervention-types';
import {PdInterventionOverview} from './pdInterventionOverview.models';
import {currentIntervention} from '../../common/selectors';

// @lajos TO DO: refactor bellow so that data is populated(wait PR to be merged from Dan and him to test his code)

export const selectPdInterventionOverview = createSelector(currentIntervention, (intervention: Intervention) => {
  return new PdInterventionOverview(intervention);
});
