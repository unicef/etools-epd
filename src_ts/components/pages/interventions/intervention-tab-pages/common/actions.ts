import {_sendRequest} from '../utils/request-helper';
import {getEndpoint} from '../utils/endpoint-helper';
import {interventionEndpoints} from '../utils/intervention-endpoints';
import {Intervention} from './models/intervention.types';

export const patchIntervention = (interventionChunck: any, interventionId?: string) => (
  dispatch: any,
  getState: any
) => {
  if (!interventionId) {
    interventionId = getState().app.routeDetails.params.interventionId;
  }
  return _sendRequest({
    endpoint: getEndpoint(interventionEndpoints.intervention, {interventionId: interventionId}),
    body: interventionChunck,
    method: 'PATCH'
  }).then((intervention: Intervention) => {
    dispatch({
      type: 'UPDATE_CURRENT_INTERVENTION',
      current: intervention
    });
  });
};
