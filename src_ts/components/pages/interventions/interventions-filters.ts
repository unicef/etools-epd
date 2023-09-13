import {AnyObject} from '@unicef-polymer/etools-types/dist/global.types';
import {get as getTranslation} from 'lit-translate';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {EtoolsFilter, EtoolsFilterTypes} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';

export enum InterventionFilterKeys {
  search = 'search',
  status = 'status',
  document_type = 'document_type',
  partners = 'partners',
  start = 'start',
  end = 'end',
  end_after = 'end_after',
  contingency_pd = 'contingency_pd',
  editable_by = 'editable_by'
}

export type FilterKeysAndTheirSelectedValues = {[key in InterventionFilterKeys]?: any};

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
  [InterventionFilterKeys.search]: 'string',
  [InterventionFilterKeys.status]: 'Array',
  [InterventionFilterKeys.document_type]: 'Array',
  [InterventionFilterKeys.partners]: 'Array',
  [InterventionFilterKeys.start]: 'string',
  [InterventionFilterKeys.end]: 'string',
  [InterventionFilterKeys.end_after]: 'string',
  [InterventionFilterKeys.contingency_pd]: 'boolean',
  [InterventionFilterKeys.editable_by]: 'string'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export function getInterventionFilters(): EtoolsFilter[] {
  return [
    {
      filterName: getTranslation('INTERVENTIONS_LIST.SEARCH_RECORDS'),
      translationKey: 'INTERVENTIONS_LIST.SEARCH_RECORDS',
      filterKey: InterventionFilterKeys.search,
      type: EtoolsFilterTypes.Search,
      selectedValue: '',
      selected: true
    },
    {
      filterName: getTranslation('INTERVENTIONS_LIST.STATUS'),
      filterKey: InterventionFilterKeys.status,
      translationKey: 'INTERVENTIONS_LIST.STATUS',
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
      filterName: getTranslation('INTERVENTIONS_LIST.PD_TYPE'),
      translationKey: 'INTERVENTIONS_LIST.PD_TYPE',
      filterKey: InterventionFilterKeys.document_type,
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
      filterName: getTranslation('INTERVENTIONS_LIST.PARTNER_ORG'),
      translationKey: 'INTERVENTIONS_LIST.PARTNER_ORG',
      filterKey: InterventionFilterKeys.partners,
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
      filterName: getTranslation('INTERVENTIONS_LIST.CONTINGENCY_PD'),
      translationKey: 'INTERVENTIONS_LIST.CONTINGENCY_PD',
      type: EtoolsFilterTypes.Toggle,
      filterKey: InterventionFilterKeys.contingency_pd,
      selectedValue: false,
      selected: true
    },
    {
      filterName: getTranslation('EDITABLE_BY'),
      translationKey: 'EDITABLE_BY',
      type: EtoolsFilterTypes.Dropdown,
      filterKey: InterventionFilterKeys.editable_by,
      selectedValue: '',
      selected: true
    },
    {
      filterName: getTranslation('INTERVENTIONS_LIST.ENDS_BEFORE'),
      translationKey: 'INTERVENTIONS_LIST.ENDS_BEFORE',
      type: EtoolsFilterTypes.Date,
      filterKey: InterventionFilterKeys.end,
      selectedValue: '',
      selected: false
    },
    {
      filterName: getTranslation('INTERVENTIONS_LIST.STARTS_AFTER'),
      translationKey: 'INTERVENTIONS_LIST.STARTS_AFTER',
      filterKey: InterventionFilterKeys.start,
      type: EtoolsFilterTypes.Date,
      selectedValue: null,
      selected: false
    },
    {
      filterName: getTranslation('INTERVENTIONS_LIST.ENDS_AFTER'),
      translationKey: 'INTERVENTIONS_LIST.ENDS_AFTER',
      type: EtoolsFilterTypes.Date,
      filterKey: InterventionFilterKeys.end_after,
      selectedValue: '',
      selected: false
    }
  ];
}

export function translateFilters(filters: AnyObject[]) {
  (filters || []).forEach((filter) => (filter.filterName = getTranslation(filter.translationKey)));
  return filters;
}
