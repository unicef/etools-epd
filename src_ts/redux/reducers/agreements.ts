import {SET_AGREEMENTS} from '../actions/agreements';
import {MinimalAgreement} from '../../components/pages/interventions/intervention-tab-pages/common/models/agreement.types';

export interface AgreementsState {
  list: MinimalAgreement[] | null;
}

const INITIAL_STATE: AgreementsState = {
  list: null
};

export const agreements = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_AGREEMENTS:
      return {
        ...state,
        list: action.list
      };
    default:
      return state;
  }
};
