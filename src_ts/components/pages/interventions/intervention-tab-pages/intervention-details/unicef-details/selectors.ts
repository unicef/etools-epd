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
      unicef_budget_owner: intervention.unicef_budget_owner,
      focal_point_list: intervention.focal_point_list || [],
      office_list: intervention.office_list || [],
      section_list: intervention.section_list || [],
      cluster_list: intervention.cluster_list || [],
      budget_owner_list: intervention.budget_owner_list || []
    },
    permissions: {
      edit: {
        unicef_office: true,
        sections: true,
        focal_points: true,
        budget_owner: true
      },
      required: {
        unicef_office: true,
        sections: true,
        focal_points: true,
        budget_owner: true
      }
    }
  };
});
