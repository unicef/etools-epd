import {AnyObject} from '../../types/globals';
import {_sendRequest} from '../../components/pages/interventions/intervention-tab-pages/utils/request-helper';
import {Intervention} from '../../components/pages/interventions/intervention-tab-pages/common/intervention-types';
import {getEndpoint} from '../../endpoints/endpoints';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';

export const setIntervention = (intervention: AnyObject) => {
  return {
    type: 'UPDATE_CURRENT_INTERVENTION',
    current: intervention
  };
};

export const getIntervention = (interventionId: string) => (dispatch: any) => {
  return _sendRequest({
    endpoint: getEndpoint(etoolsEndpoints.interventions, {interventionId: interventionId})
  }).then((intervention: Intervention) => {
    dispatch(setIntervention(intervention));
  });
};
