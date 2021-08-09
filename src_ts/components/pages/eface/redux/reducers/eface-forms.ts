import {EFACE_FORM_LOADING, SET_CURRENT_EFACE_FORM} from '../actions/eface-forms';

export interface EfaceFormsState {
  current: any;
  formLoading: boolean;
}

const INITIAL_STATE: EfaceFormsState = {
  current: null,
  formLoading: false
};

export const eface = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_CURRENT_EFACE_FORM:
      return {
        ...state,
        current: action.current
      };
    case EFACE_FORM_LOADING:
      return {
        ...state,
        formLoading: action.state
      };
    default:
      return state;
  }
};
