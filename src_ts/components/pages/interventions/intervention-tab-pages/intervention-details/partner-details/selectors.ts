import {createSelector} from 'reselect';
import {PartnerDetails, PartnerDetailsPermissions} from './partnerDetailsModels';
import {Intervention} from '../../common/models/intervention-types';

export const currentIntervention = (state: any) => state.interventions.current;
const currentInterventionPermissions = (state: any) => state.interventions.current.permissions;

export const selectPartnerDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return new PartnerDetails(intervention);
});

export const selectPartnerDetailsPermissions = createSelector(
  currentInterventionPermissions,
  (intervention: Intervention) => {
    return {
      edit: new PartnerDetailsPermissions(intervention.permissions!.edit),
      required: new PartnerDetailsPermissions(intervention.permissions!.required)
    };
  }
);
