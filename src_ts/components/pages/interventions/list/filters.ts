import {EtoolsFilter, EtoolsFilterTypes} from '../../../common/layout/filters/etools-filters';
import {AnyObject} from '../../../../types/globals';
import {isJsonStrMatch} from '../../../utils/utils';
import {RouteQueryParams} from '../../../../routing/router';
import {translate} from 'lit-translate';

export enum FilterKeys {
  search = 'search',
  status = 'status',
  document_type = 'document_type',
  partners = 'partners',
  start = 'start',
  end = 'end',
  end_after = 'end_after',
  contingency_pd = 'contingency_pd'
}

export type FilterKeysAndTheirSelectedValues = {[key in FilterKeys]?: any};

export const defaultSelectedFilters: FilterKeysAndTheirSelectedValues = {
  search: '',
  status: [],
  document_type: [],
  partners: [],
  start: null,
  end: null,
  end_after: null,
  contingency_pd: false
};

export const selectedValueTypeByFilterKey: AnyObject = {
  [FilterKeys.search]: 'string',
  [FilterKeys.status]: 'Array',
  [FilterKeys.document_type]: 'Array',
  [FilterKeys.partners]: 'Array',
  [FilterKeys.start]: 'string',
  [FilterKeys.end]: 'string',
  [FilterKeys.end_after]: 'string',
  [FilterKeys.contingency_pd]: 'boolean'
};

export const defaultFilters: EtoolsFilter[] = [
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.SEARCH_RECORDS'),
    filterKey: FilterKeys.search,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.STATUS'),
    filterKey: FilterKeys.status,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    optionValue: 'value',
    optionLabel: 'label',
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.PD_TYPE'),
    filterKey: FilterKeys.document_type,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    optionValue: 'value',
    optionLabel: 'label',
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.PARTNER_ORG'),
    filterKey: FilterKeys.partners,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    optionValue: 'id',
    optionLabel: 'name'
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.CONTINGENCY_PD'),
    type: EtoolsFilterTypes.Toggle,
    filterKey: FilterKeys.contingency_pd,
    selectedValue: false,
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.ENDS_BEFORE'),
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end,
    selectedValue: '',
    selected: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.STARTS_AFTER'),
    filterKey: FilterKeys.start,
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.FILTERS.ENDS_AFTER'),
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end_after,
    selectedValue: '',
    selected: false
  }
];

export const getSelectedFiltersFromUrlParams = (params: AnyObject): FilterKeysAndTheirSelectedValues => {
  const selectedFilters: AnyObject = {};

  for (const filterKey in params) {
    if (params[filterKey]) {
      if (selectedValueTypeByFilterKey[filterKey] === 'Array') {
        selectedFilters[filterKey] = params[filterKey].split(',');
      } else if (selectedValueTypeByFilterKey[filterKey] === 'boolean') {
        selectedFilters[filterKey] = params[filterKey] === 'true';
      } else {
        selectedFilters[filterKey] = params[filterKey];
      }
    }
  }
  return selectedFilters as FilterKeysAndTheirSelectedValues;
};

export const updateFiltersSelectedValues = (params: RouteQueryParams, filters: EtoolsFilter[]) => {
  const availableFilters = [...filters];

  const selectedFilters: FilterKeysAndTheirSelectedValues = getSelectedFiltersFromUrlParams(params);
  for (const fKey in selectedFilters) {
    if (fKey) {
      const selectedValue = selectedFilters[fKey as FilterKeys];
      if (selectedValue) {
        const filter = availableFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
        if (filter) {
          filter.selectedValue = selectedValue instanceof Array ? [...selectedValue] : selectedValue;

          filter.selected = true;
        }
      }
    }
  }

  return availableFilters;
};

export const updateFilterSelectionOptions = (filters: EtoolsFilter[], fKey: string, options: AnyObject[]) => {
  const filter = filters.find((f: EtoolsFilter) => f.filterKey === fKey);
  if (filter && options) {
    if (!isJsonStrMatch(filter.selectionOptions, options)) {
      filter.selectionOptions = [...options];
    }
  }
};
