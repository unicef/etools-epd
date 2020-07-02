import {Intervention} from '../../common/intervention-types';
import {_sendRequest} from '../../utils/request-helper';
import {getEndpoint} from '../../../../../../endpoints/endpoints';
import {interventionEndpoints} from '../../utils/intervention-endpoints';

export const updatePartnerDetails = (partnerDetails: string, interventionId: string) => (dispatch: any) => {
  return _sendRequest({
    endpoint: getEndpoint(interventionEndpoints.intervention, {interventionId: interventionId}),
    body: partnerDetails,
    method: 'PATCH'
  }).then((intervention: Intervention) => {
    dispatch({
      type: 'UPDATE_CURRENT_INTERVENTION',
      current: intervention
    });
  });
};
