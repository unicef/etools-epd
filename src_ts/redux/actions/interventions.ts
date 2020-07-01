import {AnyObject} from '../../types/globals';
import {_sendRequest} from '../../components/pages/interventions/intervention-tab-pages/utils/request-helper';
import {Intervention} from '../../components/pages/interventions/intervention-tab-pages/common/intervention-types';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {getEndpoint} from '../../endpoints/endpoints';

export const setIntervention = (intervention: AnyObject) => {
  return {
    type: 'UPDATE_CURRENT_INTERVENTION',
    current: intervention
  };
};

export const getIntervention = (interventionId: string) => (dispatch: any) => {
  return _sendRequest({
    endpoint: getEndpoint(etoolsEndpoints.intervention, {interventionId: interventionId})
  }).then((intervention: Intervention) => {
    dispatch(setIntervention(intervention));
  });
};
