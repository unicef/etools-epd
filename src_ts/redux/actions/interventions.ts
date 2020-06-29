export const getIntervention = (interventionId) => (dispatch: any) => {
  return _sendRequest({endpoint: getEndpoint(etoolsEndpoints.intervention, {interventionId: interventionId})}).then(
    (intervention: Intervention) => {
      dispatch(setBlueprint(intervention));
    }
  );
};
