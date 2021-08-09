import {Intervention} from '@unicef-polymer/etools-types';
import {EFACE_INTERVENTIONS_LOADING, SET_EFACE_INTERVENTIONS} from '../actions/eface-interventions';

export interface EfaceInterventionsState {
  list: Intervention[] | null;
  loading: boolean;
}

const INITIAL_STATE: EfaceInterventionsState = {
  list: null,
  loading: false
};

export const efaceInterventions = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_EFACE_INTERVENTIONS:
      return {
        ...state,
        list: action.list
      };
    case EFACE_INTERVENTIONS_LOADING:
      return {
        ...state,
        loading: action.state
      };
    default:
      return state;
  }
};
