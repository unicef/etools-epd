import {Reducer} from 'redux';
import {
  SET_UNICEF_USERS_DATA,
  SET_PARTNERS,
  SET_LOCATIONS,
  SET_LOCATION_TYPES,
  SET_DOCUMENT_TYPES,
  SET_GENDER_EQUITY_RATINGS
} from '../actions/common-data';
import {RootAction} from '../store';

export interface CommonDataState {
  unicefUsers: [];
  partners: [];
  locations: [];
  locationTypes: [];
  documentTypes: [];
  genderEquityRatings: [];
}

const INITIAL_COMMON_DATA: CommonDataState = {
  unicefUsers: [],
  partners: [],
  locations: [],
  locationTypes: [],
  documentTypes: [],
  genderEquityRatings: []
};

const commonData: Reducer<CommonDataState, RootAction> = (state = INITIAL_COMMON_DATA, action) => {
  switch (action.type) {
    case SET_UNICEF_USERS_DATA:
      return {
        ...state,
        unicefUsers: action.unicefUsersData
      };
    case SET_PARTNERS:
      return {
        ...state,
        partners: action.partners
      };
    case SET_LOCATIONS:
      return {
        ...state,
        locations: action.locations
      };
    case SET_LOCATION_TYPES:
      return {
        ...state,
        locationTypes: action.locationTypes
      };
    case SET_DOCUMENT_TYPES:
      return {
        ...state,
        documentTypes: action.documentTypes
      };
    case SET_GENDER_EQUITY_RATINGS:
      return {
        ...state,
        genderEquityRatings: action.genderEquityRatings
      };
    default:
      return state;
  }
};

export default commonData;
