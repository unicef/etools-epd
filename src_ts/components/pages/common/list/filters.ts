import {EtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {isJsonStrMatch} from '../../../utils/utils';
import {AnyObject, RouteQueryParams} from '@unicef-polymer/etools-types';

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
