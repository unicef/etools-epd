export const currentSubpage = (state: any) => state.app!.routeDetails.subRouteName;
export const currentPage = (state: any) => state.app!.routeDetails.routeName;
export const currentIntervention = (state: any) => state.interventions.current;
export const currentInterventionPermissions = (state: any) => state.interventions.current.permissions;
