import {UPDATE_CURRENT_INTERVENTION} from '../actionsContants';
import {Intervention} from '../../components/pages/interventions/intervention-tab-pages/common/models/intervention.types';

export interface InterventionsState {
  current: Intervention | null;
}

const INITIAL_STATE: InterventionsState = {
  current: null
};

export const interventions = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case UPDATE_CURRENT_INTERVENTION:
      return {
        ...state,
        current: action.current
      };
    default:
      return state;
  }
};
