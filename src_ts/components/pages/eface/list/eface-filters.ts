import {translate} from 'lit-translate';
import {
  EtoolsFilter,
  EtoolsFilterTypes
} from '@unicef-polymer/etools-modules-common/dist/layout/filters/etools-filters';
import {AnyObject} from '@unicef-polymer/etools-types/dist/global.types';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-modules-common/dist/list/filters';

export enum EfaceFilterKeys {
  search = 'search',
  status = 'status'
}
export const selectedValueTypeByFilterKey: AnyObject = {
  [EfaceFilterKeys.search]: 'string',
  [EfaceFilterKeys.status]: 'Array'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export const defaultFilters: EtoolsFilter[] = [
  {
    filterName: translate('INTERVENTIONS_LIST.SEARCH_RECORDS'),
    filterKey: EfaceFilterKeys.search,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.STATUS'),
    filterKey: EfaceFilterKeys.status,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [
      {label: 'Draft', value: 'draft'},
      {label: 'Submitted', value: 'submitted'},
      {label: 'Rejected', value: 'rejected'},
      {label: 'Pending', value: 'pending'},
      {label: 'Approved', value: 'approved'},
      {label: 'Closed', value: 'closed'},
      {label: 'Cancelled', value: 'cancelled'}
    ],
    optionValue: 'value',
    optionLabel: 'label',
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  }
];
