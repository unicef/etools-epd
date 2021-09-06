import {ActionCreator, Action} from 'redux';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {etoolsEndpoints} from '../../../../../endpoints/endpoints-list';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {Eface} from '../../eface-tab-pages/types';

export const SET_CURRENT_EFACE_FORM = 'SET_CURRENT_EFACE_FORM';
export const EFACE_FORM_LOADING = 'EFACE_FORM_LOADING';

export interface EfaceFormSetAction extends Action<'SET_CURRENT_EFACE_FORM'> {
  current: any;
}
export interface EfaceFormLoadingAction extends Action<'EFACE_FORM_LOADING'> {
  state: boolean;
}

export const setEfaceForm: ActionCreator<EfaceFormSetAction> = (current: Eface) => {
  return {
    type: SET_CURRENT_EFACE_FORM,
    current
  };
};

export const setEfaceFormLoading: ActionCreator<EfaceFormLoadingAction> = (state: boolean) => {
  return {
    type: EFACE_FORM_LOADING,
    state
  };
};

export type EfaceInterventionsAction = EfaceFormSetAction | EfaceFormLoadingAction;

export const getEfaceForm = (id: number | string) => (dispatch: any, getState: any) => {
  if ((getState() as any)?.eface?.formLoading) {
    return Promise.resolve(false);
  }
  dispatch(setEfaceFormLoading(true));
  const endpoint = getEndpoint(etoolsEndpoints.efaceForm, {id});
  return sendRequest({
    endpoint: {url: endpoint.url}
  })
    .then((form) => {
      dispatch(setEfaceForm(form));
    })
    .finally(() => {
      dispatch(setEfaceFormLoading(false));
    });
};
