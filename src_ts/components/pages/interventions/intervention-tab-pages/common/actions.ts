import {_sendRequest} from '../utils/request-helper';
import {getEndpoint} from '../utils/get-endpoints';
import {interventionEndpoints} from '../utils/intervention-endpoints';
import {Intervention} from './types/intervention-types';

export const patchIntervention = (interventionChunck: string, interventionId: string) => (dispatch: any) => {
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
