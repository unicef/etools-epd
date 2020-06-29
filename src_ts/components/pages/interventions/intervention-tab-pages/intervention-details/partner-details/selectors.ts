import {createSelector} from 'reselect';
import {Intervention} from '../../common/intervention-types';

export const currentIntervention = (state: any) => state.interventions.current;

export const selectPartnerDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return {
    details: {
      partner: intervention.partner,
      partner_name: intervention.partner_name
      // etc
    },
    permissions: {}
  };
});
