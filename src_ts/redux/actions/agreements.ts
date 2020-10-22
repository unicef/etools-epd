import {ActionCreator, Action} from 'redux';
// eslint-disable-next-line max-len
import {MinimalAgreement} from '../../components/pages/interventions/intervention-tab-pages/common/models/agreement.types';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';

export const SET_AGREEMENTS = 'SET_AGREEMENTS';

export interface AgreementsActionSet extends Action<'SET_AGREEMENTS'> {
  list: MinimalAgreement[];
}

export const setAgreements: ActionCreator<AgreementsActionSet> = (list: MinimalAgreement[]) => {
  return {
    type: SET_AGREEMENTS,
    list
  };
};

export type AgreementsAction = AgreementsActionSet;

export const getAgreements = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.agreements.url!}
  });
};
