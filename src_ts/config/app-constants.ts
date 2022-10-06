import {GenericObject} from '@unicef-polymer/etools-types/dist/global.types';

const CONSTANTS = {
  DOCUMENT_TYPES: {
    PD: 'PD',
    SSFA: 'SSFA',
    SHPD: 'SHPD',
    ProgrammeDocument: 'Programme Document',
    SmallScaleFundingAgreement: 'Small Scale Funding Agreement',
    SimplifiedHumanitarianProgrammeDocument: 'Simplified Humanitarian Programme Document'
  }
};

export const appLanguages: GenericObject<string>[] = [
  {value: 'en', display_name: 'English'},
  {value: 'ar', display_name: 'Arabic'},
  {value: 'pt', display_name: 'Portuguese'},
  {value: 'ru', display_name: 'Russian'},
  {value: 'fr', display_name: 'French'},
  {value: 'es', display_name: 'Spanish'}
];

export default CONSTANTS;
