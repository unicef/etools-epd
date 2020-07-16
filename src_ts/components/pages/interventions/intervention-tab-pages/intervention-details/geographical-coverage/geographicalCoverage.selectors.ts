import {createSelector} from 'reselect';
import {Intervention, Permission, InterventionPermissionsFields} from '../../common/models/intervention-types';
import {currentInterventionPermissions, currentIntervention} from '../../common/selectors';
import {Locations, LocationsPermissions} from './geographicalCoverage.models';

export const selectLocations = createSelector(currentIntervention, (intervention: Intervention) => {
  return new Locations(intervention);
});

export const selectLocationsPermissions = createSelector(
  currentInterventionPermissions,
  (permissions: Permission<InterventionPermissionsFields>) => {
    return {
      edit: new LocationsPermissions(permissions!.edit),
      required: new LocationsPermissions(permissions!.required)
    };
  }
);
