import {createSelector} from 'reselect';
import {Intervention, Permission, InterventionPermissionsFields} from '../../common/models/intervention.types';
import {Document, DocumentPermission} from './ManagementDocument.model';
import {currentInterventionPermissions, currentIntervention} from '../../common/selectors';

export const selectDocument = createSelector(currentIntervention, (intervention: Intervention) => {
  return new Document(intervention);
});

export const selectDocumentPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Permission<InterventionPermissionsFields>) => {
    return {
      edit: new DocumentPermission(permissions!.edit),
      required: new DocumentPermission(permissions!.required)
    };
  }
);
