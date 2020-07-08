import {createSelector} from 'reselect';
import {Intervention} from '../../common/models/intervention-types';
import {PdInterventionOverview} from './pdInterventionOverview.models';
import {currentIntervention} from '../../common/selectors';

export const selectPdInterventionOverview = createSelector(currentIntervention, (intervention: Intervention) => {
  return new PdInterventionOverview(intervention);
});
