import {createSelector} from 'reselect';
import {Intervention} from '../../common/models/intervention-types';
import {DocumentDetails, DocumentDetailsPermissions} from './documentDetailsModels';
import {currentIntervention, currentInterventionPermissions} from '../../selectors';

export const selectDocumentDetails = createSelector(currentIntervention, (intervention: Intervention) => {
  return new DocumentDetails(intervention);
});

export const selectDocumentDetailsPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Intervention) => {
    return {
      edit: new DocumentDetailsPermissions(permissions!.edit),
      required: new DocumentDetailsPermissions(permissions!.required)
    };
  }
);
