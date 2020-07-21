import {createSelector} from 'reselect';
import {Intervention, Permission, InterventionPermissionsFields} from '../../common/models/intervention.types';
import {currentIntervention, currentInterventionPermissions} from '../../common/selectors';
import {ProgrammeManagement, ProgrammeManagementPermissions} from './effectiveAndEfficientProgrammeManagement.models';

export const selectProgrammeManagement = createSelector(currentIntervention, (intervention: Intervention) => {
  return new ProgrammeManagement(intervention);
});

export const selectProgrammeManagementPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Permission<InterventionPermissionsFields>) => {
    return {
      edit: new ProgrammeManagementPermissions(permissions!.edit),
      required: new ProgrammeManagementPermissions(permissions!.required)
    };
  }
);
