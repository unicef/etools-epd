import {createSelector} from 'reselect';
import {Intervention} from '../../common/intervention-types';

export const currentIntervention = (state: any) => state.interventions.current;

export const selectPdUnicefDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return {
    details: {
      document_type: intervention.document_type,
      offices: intervention.offices,
      sections: intervention.sections,
      clusters: intervention.clusters,
      unicef_focal_points: intervention.unicef_focal_points,
      unicef_budget_owner: intervention.unicef_budget_owner
    },
    permissions: {
      edit: {
        unicef_office: true,
        sections: true,
        focal_points: true,
        budget_owner: false
      },
      required: {
        unicef_office: true,
        sections: true,
        focal_points: true,
        budget_owner: false
      }
    }
  };
});
