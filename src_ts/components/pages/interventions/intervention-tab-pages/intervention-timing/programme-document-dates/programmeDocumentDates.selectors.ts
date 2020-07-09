import {createSelector} from 'reselect';
import {Intervention, Permission, InterventionPermissionsFields} from '../../common/models/intervention-types';
import {ProgrammeDocDates, ProgrammeDocumentDatesPermissions} from './programmeDocumentDates.models';
import {currentInterventionPermissions, currentIntervention} from '../../common/selectors';

export const selectProgrammeDocumentDates = createSelector(currentIntervention, (intervention: Intervention) => {
  return new ProgrammeDocDates(intervention);
});

export const selectProgrammeDocumentDatesPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Permission<InterventionPermissionsFields>) => {
    return {
      edit: new ProgrammeDocumentDatesPermissions(permissions!.edit),
      required: new ProgrammeDocumentDatesPermissions(permissions!.required)
    };
  }
);
