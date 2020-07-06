import {createSelector} from 'reselect';
import {Intervention} from '../../common/types/intervention-types';

export const currentIntervention = (state: any) => state.interventions.current;

export const selectDocumentDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return {
    details: {
      title: intervention.title,
      context: intervention.context,
      implementation_strategy: intervention.implementation_strategy,
      ip_progr_contrib: intervention.ip_progr_contrib
    },
    permissions: {
      edit: {
        title: true,
        context: true,
        implementation_strategy: true,
        ip_progr_contrib: true
      }
    }
  };
});
