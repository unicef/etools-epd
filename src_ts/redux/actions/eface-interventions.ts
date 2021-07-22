import {ActionCreator, Action} from 'redux';
import {Intervention} from '@unicef-polymer/etools-types';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {store} from '../store';

export const SET_EFACE_INTERVENTIONS = 'SET_EFACE_INTERVENTIONS';
export const EFACE_INTERVENTIONS_LOADING = 'EFACE_INTERVENTIONS_LOADING';

export interface EfaceInterventionsSetAction extends Action<'SET_EFACE_INTERVENTIONS'> {
  list: Intervention[];
}
export interface EfaceInterventionsLoadingAction extends Action<'EFACE_INTERVENTIONS_LOADING'> {
  state: boolean;
}

export const setEfaceInterventions: ActionCreator<EfaceInterventionsSetAction> = (list: Intervention[]) => {
  return {
    type: SET_EFACE_INTERVENTIONS,
    list
  };
};

export const setEfaceInterventionsLoading: ActionCreator<EfaceInterventionsLoadingAction> = (state: boolean) => {
  return {
    type: EFACE_INTERVENTIONS_LOADING,
    state
  };
};

export type EfaceInterventionsAction = EfaceInterventionsSetAction | EfaceInterventionsLoadingAction;

export const getEfaceInterventions = () => {
  if ((store.getState() as any)?.efaceInterventions?.loading) {
    return;
  }
  store.dispatch(setEfaceInterventionsLoading(true));
  return sendRequest({
    endpoint: {url: etoolsEndpoints.interventions.url!}
  })
    .then((interventions) => store.dispatch(setEfaceInterventions(interventions)))
    .finally(() => store.dispatch(setEfaceInterventionsLoading(false)));
};
