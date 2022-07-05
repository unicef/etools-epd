import {AnyObject} from '@unicef-polymer/etools-types/dist/global.types';
import {translate} from 'lit-translate';
import {EtoolsFilter, EtoolsFilterTypes} from '@unicef-polymer/etools-filters/src/etools-filters';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-filters/src/filters';

export enum InterventionFilterKeys {
  search = 'search',
  status = 'status'
}

export type FilterKeysAndTheirSelectedValues = {[key in InterventionFilterKeys]?: any};

export const defaultSelectedFilters: FilterKeysAndTheirSelectedValues = {
  search: '',
  status: []
};

export const selectedValueTypeByFilterKey: AnyObject = {
  [InterventionFilterKeys.search]: 'string',
  [InterventionFilterKeys.status]: 'Array'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export const defaultFilters: EtoolsFilter[] = [
  {
    filterName: translate('INTERVENTIONS_LIST.SEARCH_RECORDS'),
    filterKey: InterventionFilterKeys.search,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.STATUS'),
    filterKey: InterventionFilterKeys.status,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    optionValue: 'value',
    optionLabel: 'label',
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  }
];
