import {Reducer} from 'redux';
import {SET_ALL_STATIC_DATA} from '../actions/common-data';
import {RootAction} from '../store';
import {CpOutput, Disaggregation, LocationObject, Section, LabelAndValue} from '../../types/globals';

export interface CommonDataState {
  unicefUsersData: [];
  partners: [];
  locations: LocationObject[];
  sections: Section[];
  disaggregations: Disaggregation[];
  cpOutputs: CpOutput[];
  locationTypes: [];
  documentTypes: [];
  genderEquityRatings: [];
  interventionAmendmentTypes: LabelAndValue[];
  offices: [];
}

const INITIAL_COMMON_DATA: CommonDataState = {
  unicefUsersData: [],
  partners: [],
  locations: [],
  sections: [],
  disaggregations: [],
  locationTypes: [],
  documentTypes: [],
  genderEquityRatings: [],
  interventionAmendmentTypes: [],
  offices: [],
  cpOutputs: []
};

const commonData: Reducer<CommonDataState, RootAction> = (state = INITIAL_COMMON_DATA, action) => {
  switch (action.type) {
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
        cpOutputs: action.staticData.cpOutputs,
        interventionAmendmentTypes: action.staticData.interventionAmendmentTypes,
        offices: action.staticData.offices,
        unicefUsersData: action.staticData.unicefUsersData
      };
    default:
      return state;
  }
};

export default commonData;
