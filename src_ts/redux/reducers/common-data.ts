import {Reducer} from 'redux';
import {SET_ALL_STATIC_DATA, UPDATE_ENV_FLAGS} from '../actions/common-data';
import {RootAction} from '../store';
import {CpOutput, Disaggregation, LocationObject, Section, LabelAndValue, EnvFlags} from '../../types/globals';

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
  currencies: LabelAndValue[];
  envFlags: EnvFlags | null;
  riskTypes: LabelAndValue[];
  fileTypes: any[];
  cashTransferModalities: any[];
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
  cpOutputs: [],
  currencies: [],
  riskTypes: [],
  envFlags: null,
  fileTypes: [],
  cashTransferModalities: []
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
        genderEquityRatings: action.staticData.genderEquityRatings, // TODO -make sure data is loaded from bk
        cpOutputs: action.staticData.cpOutputs,
        interventionAmendmentTypes: action.staticData.interventionAmendmentTypes,
        offices: action.staticData.offices,
        unicefUsersData: action.staticData.unicefUsersData,
        currencies: action.staticData.currencies,
        riskTypes: action.staticData.riskTypes,
        fileTypes: action.staticData.fileTypes,
        cashTransferModalities: action.staticData.cashTransferModalities
      };
    case UPDATE_ENV_FLAGS:
      return {
        ...state,
        envFlags: action.envFlags
      };
    default:
      return state;
  }
};

export default commonData;
