import {createSelector} from 'reselect';
import {Intervention} from '../../common/models/intervention-types';
import {PdUnicefDetails, PdUnicefDetailsPermissions} from './pdUnicefDetails.models';
import {currentInterventionPermissions, currentIntervention} from '../../selectors';

export const selectPdUnicefDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return new PdUnicefDetails(intervention);
});

export const selectPdUnicefDetailsPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Intervention) => {
    return {
      edit: new PdUnicefDetailsPermissions(permissions!.edit),
      required: new PdUnicefDetailsPermissions(permissions!.required)
    };
  }
);
