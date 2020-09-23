import {EtoolsFilter, EtoolsFilterTypes} from '../../../common/layout/filters/etools-filters';
import {AnyObject} from '../../../../types/globals';
import {isJsonStrMatch} from '../../../utils/utils';
import {RouteQueryParams} from '../../../../routing/router';

export const DEVELOPMENT_STATUS = 'draft';
export const REVIEW_STATUS = 'review';
export const SIGNATURE_STATUS = 'signature';
export const SIGNED_STATUS = 'signed';
export const ACTIVE_STATUS = 'active';
export const ENDED_STATUS = 'ended';
export const CLOSED_STATUS = 'closed';
export const SUSPENDED_STATUS = 'suspended';
export const TERMINATED_STATUS = 'terminated';

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
    filterName: 'Search records',
    filterKey: FilterKeys.search,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: 'Status',
    filterKey: FilterKeys.status,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [
      {
        id: DEVELOPMENT_STATUS,
        name: 'Development'
      },
      {
        id: REVIEW_STATUS,
        name: 'Review'
      },
      {
        id: SIGNATURE_STATUS,
        name: 'Signature'
      },
      {
        id: SIGNED_STATUS,
        name: 'Signed'
      },
      {
        id: ACTIVE_STATUS,
        name: 'Active'
      },
      {
        id: ENDED_STATUS,
        name: 'Ended'
      },
      {
        id: CLOSED_STATUS,
        name: 'Closed'
      },
      {
        id: SUSPENDED_STATUS,
        name: 'Suspended'
      },
      {
        id: TERMINATED_STATUS,
        name: 'Terminated'
      }
    ],
    optionValue: 'id',
    optionLabel: 'name',
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'PD/SSFA Type',
    filterKey: FilterKeys.document_type,
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [
      {
        id: 'HPD',
        name: 'Humanitarian Programme Document'
      },
      {
        id: 'PD',
        name: 'Programme Document'
      },
      {
        id: 'SSFA',
        name: 'SSFA'
      }
    ],
    optionValue: 'id',
    optionLabel: 'name',
    selectedValue: [],
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Partner Org',
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
    filterName: 'Contingency PD',
    type: EtoolsFilterTypes.Toggle,
    filterKey: FilterKeys.contingency_pd,
    selectedValue: false,
    selected: true
  },
  {
    filterName: 'Ends Before',
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end,
    selectedValue: '',
    selected: false
  },
  {
    filterName: 'Starts After',
    filterKey: FilterKeys.start,
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  },
  {
    filterName: 'Ends After',
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end_after,
    selectedValue: '',
    selected: false
  }
];

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
