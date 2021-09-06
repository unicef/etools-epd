import {GenericObject} from '@unicef-polymer/etools-types';

export enum EfaceItemTypes_Short {
  'activity' = 'activity',
  'eepm' = 'eepm',
  'custom' = 'custom'
}

enum FormTypes {
  dct = 'dct',
  rmb = 'rmb',
  dp = 'dp'
}

export const EfaceFormTypes = new Map<string, GenericObject<string>>([
  [FormTypes.dct, {label: 'Direct Cash Transfer', value: FormTypes.dct}],
  [FormTypes.rmb, {label: 'Reimbursement', value: FormTypes.rmb}],
  [FormTypes.dp, {label: 'Direct Payment', value: FormTypes.dp}]
]);
