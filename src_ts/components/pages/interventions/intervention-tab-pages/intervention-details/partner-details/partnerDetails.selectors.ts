import {createSelector} from 'reselect';
import {PartnerDetails, PartnerDetailsPermissions} from './partnerDetails.models';
import {Intervention} from '../../common/models/intervention-types';
import {currentIntervention, currentInterventionPermissions} from '../../selectors';

export const selectPartnerDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return new PartnerDetails(intervention);
});

export const selectPartnerDetailsPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Intervention) => {
    return {
      edit: new PartnerDetailsPermissions(permissions!.edit),
      required: new PartnerDetailsPermissions(permissions!.required)
    };
  }
);
