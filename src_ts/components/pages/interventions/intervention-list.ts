import '@polymer/paper-button/paper-button';
import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';

import '../../common/layout/page-content-header/page-content-header';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';

import '../../common/layout/filters/etools-filters';
import {defaultFilters, updateFilterSelectionOptions, updateFiltersSelectedValues} from './list/filters';
import {ROOT_PATH} from '../../../config/config';
import {EtoolsFilter} from '../../common/layout/filters/etools-filters';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {buttonsStyles} from '../../styles/button-styles';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import '@unicef-polymer/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '@unicef-polymer/etools-table/etools-table';
import {EtoolsPaginator, defaultPaginator} from '@unicef-polymer/etools-table/pagination/etools-pagination';
import {
  buildUrlQueryString,
  getSortFields,
  getUrlQueryStringSort
} from '../../common/layout/etools-table/etools-table-utility';
import {RouteDetails, RouteQueryParams} from '../../../routing/router';
import {replaceAppLocation} from '../../../routing/routes';
import {SharedStylesLit} from '../../styles/shared-styles-lit';

import '@unicef-polymer/etools-loading';
import get from 'lodash-es/get';
import '../../common/layout/export-data';
import {GenericObject, LabelAndValue} from '../../../types/globals';
import {InterventionsListHelper, ListHelperResponse} from './list/list-helper';
import {InterventionsListStyles, InterventionsTableStyles} from './list/list-styles';
import {isJsonStrMatch} from '../../utils/utils';
import {EtoolsCurrency} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-mixin';
import {notHiddenPartnersSelector} from '../../../redux/reducers/common-data';
import {translate} from 'lit-translate';

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-list')
export class InterventionList extends connect(store)(EtoolsCurrency(LitElement)) {
  static get styles() {
    return [elevationStyles, buttonsStyles, pageLayoutStyles, pageContentHeaderSlottedStyles, InterventionsListStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStylesLit}
      <style>
        .col_type {
          white-space: pre-line !important;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">${translate('INTERVENTIONS_LIST.TITLE')}</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <div class="action">
            <export-data .params="${this.exportParams}" raised></export-data>
          </div>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}" @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>
        <etools-table
          caption="${translate('INTERVENTIONS_LIST.TABLE_TITLE')}"
          .columns="${this.listColumns}"
          .items="${this.listData.length ? this.listData : [{}]}"
          .paginator="${this.paginator}"
          .getChildRowTemplateMethod="${this.listData.length ? this.getRowDetails.bind(this) : null}"
          .extraCSS="${InterventionsTableStyles}"
          singleSort
          @paginator-change="${this.paginatorChange}"
          @sort-change="${this.sortChange}"
        ></etools-table>
      </section>
    `;
  }

  @property({type: Array})
  listData: InterventionListData[] = [];

  @property({type: Object})
  paginator: EtoolsPaginator = {...defaultPaginator};

  @property({type: Array})
  filters!: EtoolsFilter[] | null;

  @property({type: Boolean})
  canExport = false;

  @property({type: String})
  exportParams = '';

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  interventionStatuses!: LabelAndValue[];

  @property({type: Object})
  urlParams!: GenericObject<any>;

  listColumns: EtoolsTableColumn[] = [
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.REFERENCE_NO') as unknown) as string,
      name: 'number',
      link_tmpl: `${ROOT_PATH}interventions/:id/details`,
      type: EtoolsTableColumnType.Link,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.PARTNER_ORG_NAME') as unknown) as string,
      name: 'partner_name',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.DOC_TYPE') as unknown) as string,
      name: 'document_type',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.STATUS') as unknown) as string,
      name: 'status',
      type: EtoolsTableColumnType.Custom,
      capitalize: true,
      sort: null,
      customMethod: (item: any, _key: string) => {
        if (item.status !== 'development') {
          return item.status;
        }
        if (item.partner_accepted && item.unicef_accepted) {
          return html`${item.status} <br />
            IP & Unicef Accepted`;
        }
        if (!item.partner_accepted && item.unicef_accepted) {
          return html`${item.status} <br />
            Unicef Accepted`;
        }
        if (item.partner_accepted && !item.unicef_accepted) {
          return html`${item.status} <br />
            IP Accepted`;
        }
        if (!item.unicef_court && !!item.date_sent_to_partner) {
          return html`${item.status} <br />
            Sent to Partner`;
        }

        if (item.unicef_court && !!item.date_draft_by_partner) {
          return html`${item.status} <br />
            Sent to Unicef`;
        }
        return item.status;
      },
      cssClass: 'col_type'
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.TITLE') as unknown) as string,
      name: 'title',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.START_DATE') as unknown) as string,
      name: 'start',
      type: EtoolsTableColumnType.Date,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.COLUMNS.END_DATE') as unknown) as string,
      name: 'end',
      type: EtoolsTableColumnType.Date,
      sort: null
    }
  ];

  private listHelper = new InterventionsListHelper();
  private routeDetails!: RouteDetails | null;
  private paramsInitialized = false;

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
    if (!(routeDetails.routeName === 'interventions' && routeDetails.subRouteName === 'list')) {
      this.paramsInitialized = false;
      this.routeDetails = null;
      return; // Avoid code execution while on a different page
    }

    const stateRouteDetails = {...state.app!.routeDetails};
    if (JSON.stringify(stateRouteDetails) !== JSON.stringify(this.routeDetails)) {
      this.onParamsChange(stateRouteDetails);
    }

    if (!isJsonStrMatch(this.interventionStatuses, state.commonData!.interventionStatuses)) {
      this.interventionStatuses = [...state.commonData!.interventionStatuses];
    }

    if (state.user && state.user.permissions) {
      this.canExport = state.user.permissions.canExport;
    }

    this.initFiltersForDisplay(state);
  }

  onParamsChange(routeDetails: RouteDetails): void {
    this.routeDetails = routeDetails;

    const currentParams: GenericObject<any> = this.routeDetails.queryParams || {};
    const paramsValid: boolean = this.paramsInitialized || this.initializeAndValidateParams(currentParams);

    if (paramsValid) {
      // get data as params are valid
      this.getListData();
    }
  }

  getRowDetails(item: InterventionListData): {rowHTML: TemplateResult} {
    return {
      rowHTML: html`
        <td colspan="8">
          <div class="details">
            <div>
              <div class="title">Total Budget</div>
              <div class="detail">
                ${item.budget_currency || ''} ${this.addCurrencyAmountDelimiter(item.total_budget)}
              </div>
            </div>
            <div>
              <div class="title">UNICEF Cash Contribution</div>
              <div class="detail">
                ${item.budget_currency || ''} ${this.addCurrencyAmountDelimiter(item.unicef_cash)}
              </div>
            </div>
          </div>
        </td>
      `
    };
  }

  filtersChange(e: CustomEvent) {
    this.updateCurrentParams({...e.detail, page: 1});
  }

  paginatorChange(e: CustomEvent) {
    const {page, page_size}: EtoolsPaginator = e.detail;
    this.updateCurrentParams({page, page_size});
  }

  sortChange(e: CustomEvent) {
    const sort = getSortFields(e.detail);
    this.updateCurrentParams({sort: getUrlQueryStringSort(sort)});
  }

  private updateCurrentParams(paramsToUpdate: GenericObject<any>): void {
    const currentParams: RouteQueryParams = this.routeDetails!.queryParams || {};
    const newParams: RouteQueryParams = {...currentParams, ...paramsToUpdate};
    this.urlParams = newParams;
    const stringParams: string = buildUrlQueryString(newParams);
    this.exportParams = stringParams;
    replaceAppLocation(`${this.routeDetails!.path}?${stringParams}`, true);
  }

  private async getListData() {
    const currentParams: GenericObject<any> = this.routeDetails!.queryParams || {};
    try {
      this.showLoading = true;
      const {list, paginator}: ListHelperResponse<InterventionListData> = await this.listHelper.getList(currentParams);
      this.listData = list;
      // remove this after status draft comes as development
      this.mapDraftToDevelop(this.listData);
      // update paginator (total_pages, visible_range, count...)
      this.paginator = paginator;
      this.showLoading = false;
    } catch (error) {
      console.error('[EtoolsInterventionsList]: get Interventions req error...', error);
    }
  }

  private mapDraftToDevelop(data: InterventionListData[]) {
    return data.forEach((intervention: InterventionListData) => {
      if (Object.hasOwnProperty.call(intervention, 'status') && intervention.status === 'draft') {
        intervention.status = 'development';
      }
    });
  }

  private initFiltersForDisplay(state: RootState) {
    if (!this.filters && this.dataRequiredByFiltersHasBeenLoaded(state)) {
      const availableFilters = [...defaultFilters];
      this.populateDropdownFilterOptionsFromCommonData(state, availableFilters);

      // update filter selection and assign the result to etools-filters(trigger render)
      const currentParams: RouteQueryParams = state.app!.routeDetails.queryParams || {};
      this.filters = updateFiltersSelectedValues(currentParams, availableFilters);
    }
  }

  private dataRequiredByFiltersHasBeenLoaded(state: RootState): boolean {
    return !!(
      state.commonData &&
      get(state, 'commonData.partners.length') &&
      get(state, 'commonData.interventionStatuses.length') &&
      get(state, 'commonData.documentTypes.length') &&
      this.routeDetails!.queryParams &&
      Object.keys(this.routeDetails!.queryParams).length > 0
    );
  }

  private populateDropdownFilterOptionsFromCommonData(state: RootState, currentFilters: EtoolsFilter[]) {
    updateFilterSelectionOptions(currentFilters, 'partners', notHiddenPartnersSelector(state));
    updateFilterSelectionOptions(currentFilters, 'status', state.commonData!.interventionStatuses);
    updateFilterSelectionOptions(currentFilters, 'document_type', state.commonData!.documentTypes);
  }

  private initializeAndValidateParams(currentParams: GenericObject<any>): boolean {
    this.paramsInitialized = true;

    // update sort in listColumns
    const [field, direction] = (currentParams.sort || '').split('.');
    if (field && direction) {
      this.listColumns = this.listColumns.map((column: EtoolsTableColumn) => {
        if (column.name !== field) {
          return column;
        } else {
          return {
            ...column,
            sort: direction as EtoolsTableColumnSort
          };
        }
      });
    }

    // set required params in url
    if (!currentParams.page_size) {
      // urlParams store page previous filtering params, if set, apply them to preserve user filters selection
      this.updateCurrentParams(
        this.urlParams
          ? this.urlParams
          : {
              page_size: '20',
              status: ['draft', 'active', 'review', 'signed', 'signature']
            }
      );
      return false;
    } else {
      return true;
    }
  }
}
