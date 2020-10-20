import {Reducer} from 'redux';
import {SET_ALL_STATIC_DATA, UPDATE_ENV_FLAGS, UPDATE_PRP_COUNTRIES} from '../actions/common-data';
import {RootAction} from '../store';
import {CpOutput, Disaggregation, LocationObject, Section, LabelAndValue, EnvFlags} from '../../types/globals';
import {createSelector} from 'reselect';

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
  interventionStatuses: LabelAndValue[];
  offices: [];
  currencies: LabelAndValue[];
  envFlags: EnvFlags | null;
  riskTypes: LabelAndValue[];
  fileTypes: any[];
  cashTransferModalities: any[];
  PRPCountryData: any[];
  countryProgrammes: any[];
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
  interventionStatuses: [],
  offices: [],
  cpOutputs: [],
  currencies: [],
  riskTypes: [],
  envFlags: null,
  fileTypes: [],
  cashTransferModalities: [],
  PRPCountryData: [],
  /** Given that countryProgrammes won't be shown to Partner user,
   * there is no need to populate this field in ePD with actual data, except for easier testing
   */
  countryProgrammes: []
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
        interventionStatuses: action.staticData.interventionStatuses,
        offices: action.staticData.offices,
        unicefUsersData: action.staticData.unicefUsersData,
        currencies: action.staticData.currencies,
        riskTypes: action.staticData.riskTypes,
        fileTypes: action.staticData.fileTypes,
        cashTransferModalities: action.staticData.cashTransferModalities,
        countryProgrammes: action.staticData.countryProgrammes
      };
    case UPDATE_ENV_FLAGS:
      return {
        ...state,
        envFlags: action.envFlags
      };
    case UPDATE_PRP_COUNTRIES:
      return {
        ...state,
        PRPCountryData: action.PRPCountryData
      };
    default:
      return state;
  }
};

const partnersSelector = (state: any) => state.commonData!.partners;
export const notHiddenPartnersSelector = createSelector(partnersSelector, (partners: any) => {
  return partners.filter((p: any) => !p.hidden);
});

export default commonData;
