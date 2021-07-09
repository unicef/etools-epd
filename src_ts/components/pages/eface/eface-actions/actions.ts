import {GenericObject} from '@unicef-polymer/etools-types';
import {get as getTranslation} from 'lit-translate';

const EXPORT_COMMENTS = 'download_comments';
const EXPORT_CSV = 'export';
const EXPORT_PDF = 'generate_pdf';

const ACCEPT = 'accept';
export const REJECT = 'reject';
export const CANCEL = 'cancel';
export const SUBMIT = 'submit';

export const EXPORT_ACTIONS = [EXPORT_CSV, EXPORT_PDF];
export const BACK_ACTIONS = [REJECT];
export const ACTIONS_WITH_INPUT = [CANCEL, REJECT];
export const ACTIONS_WITHOUT_CONFIRM = [];

export const namesMap: GenericObject<string> = {
  [EXPORT_COMMENTS]: getTranslation('EXPORT_COMMENTS'),
  [EXPORT_CSV]: getTranslation('EXPORT_CSV'),
  [EXPORT_PDF]: getTranslation('EXPORT_PDF'),
  [ACCEPT]: getTranslation('ACCEPT'),
  [CANCEL]: getTranslation('GENERAL.CANCEL'),
  [SUBMIT]: getTranslation('SUBMIT')
};
