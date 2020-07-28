import {Reducer} from 'redux';
import {
  SET_UNICEF_USERS_DATA,
  SET_PARTNERS,
  SET_LOCATIONS,
  SET_LOCATION_TYPES,
  SET_DOCUMENT_TYPES,
  SET_GENDER_EQUITY_RATINGS,
  SET_SECTIONS,
  SET_DISAGGREGATIONS,
  SET_ALL_STATIC_DATA
} from '../actions/common-data';
import {RootAction} from '../store';
import {Disaggregation, LocationObject, Section, LabelAndValue} from '../../types/globals';

export interface CommonDataState {
  unicefUsers: [];
  partners: [];
  locations: LocationObject[];
  sections: Section[];
  disaggregations: Disaggregation[];
  locationTypes: [];
  documentTypes: [];
  genderEquityRatings: [];
  interventionAmendmentTypes: LabelAndValue[];
}

const INITIAL_COMMON_DATA: CommonDataState = {
  unicefUsers: [],
  partners: [],
  locations: [],
  sections: [],
  disaggregations: [],
  locationTypes: [],
  documentTypes: [],
  genderEquityRatings: [],
  interventionAmendmentTypes: []
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
    case SET_SECTIONS:
      return {
        ...state,
        sections: action.sections
      };
    case SET_DISAGGREGATIONS:
      return {
        ...state,
        disaggregations: action.disaggregations
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
    case SET_ALL_STATIC_DATA:
      return {
        ...state,
        partners: action.staticData.partners,
        locations: action.staticData.locations,
        sections: action.staticData.sections,
        disaggregations: action.staticData.disaggregations,
        locationTypes: action.staticData.locationTypes,
        documentTypes: action.staticData.documentTypes,
        genderEquityRatings: action.staticData.genderEquityRatings,
        interventionAmendmentTypes: action.staticData.interventionAmendmentTypes
      };
    default:
      return state;
  }
};

export default commonData;
