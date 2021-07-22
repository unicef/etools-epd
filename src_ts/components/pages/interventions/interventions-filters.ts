import {EtoolsFilter, EtoolsFilterTypes} from '../../common/layout/filters/etools-filters';
import {translate} from 'lit-translate';
import {FilterKeys} from '../common/list/filters';

export const defaultFilters: EtoolsFilter[] = [
  {
    filterName: translate('INTERVENTIONS_LIST.SEARCH_RECORDS'),
    filterKey: FilterKeys.search,
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.STATUS'),
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
    filterName: translate('INTERVENTIONS_LIST.PD_TYPE'),
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
    filterName: translate('INTERVENTIONS_LIST.PARTNER_ORG'),
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
    filterName: translate('INTERVENTIONS_LIST.CONTINGENCY_PD'),
    type: EtoolsFilterTypes.Toggle,
    filterKey: FilterKeys.contingency_pd,
    selectedValue: false,
    selected: true
  },
  {
    filterName: translate('INTERVENTIONS_LIST.ENDS_BEFORE'),
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end,
    selectedValue: '',
    selected: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.STARTS_AFTER'),
    filterKey: FilterKeys.start,
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  },
  {
    filterName: translate('INTERVENTIONS_LIST.ENDS_AFTER'),
    type: EtoolsFilterTypes.Date,
    filterKey: FilterKeys.end_after,
    selectedValue: '',
    selected: false
  }
];
