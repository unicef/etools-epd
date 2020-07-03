import {createSelector} from 'reselect';
import {Intervention} from '../../common/intervention-types';

export const currentIntervention = (state: any) => state.interventions.current;

export const selectDocumentDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return {
    details: {
      title: intervention.title,
      context: intervention.context,
      implementation_strategy: intervention.implementation_strategy,
      partner_contribution: intervention.partner_contribution
      // etc
    },
    permissions: {}
  };
});