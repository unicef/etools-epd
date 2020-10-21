import {Reducer} from 'redux';
import {ActiveLanguageActionTypes, ActiveLanguageTypes} from '../actions/active-language';

export interface ActiveLanguageState {
  activeLanguage: string;
}

const INITIAL_STATE: ActiveLanguageState = {
  activeLanguage: 'en'
};

export const activeLanguage: Reducer<ActiveLanguageState, any> = (
  state: ActiveLanguageState = INITIAL_STATE,
  action: ActiveLanguageTypes
) => {
  switch (action.type) {
    case ActiveLanguageActionTypes.ACTIVE_LANGUAGE_SWITCHED:
      return {...state, activeLanguage: action.payload};
    default:
      return state;
  }
};
