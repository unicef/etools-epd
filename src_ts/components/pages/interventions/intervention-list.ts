import '@polymer/paper-button/paper-button';
import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';

import '../../common/layout/page-content-header/page-content-header';
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

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-list')
export class InterventionList extends connect(store)(LitElement) {
  static get styles() {
    return [elevationStyles, buttonsStyles, pageLayoutStyles, pageContentHeaderSlottedStyles, InterventionsListStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStylesLit}
      <page-content-header>
        <h1 slot="page-title">PDs/SPDs list</h1>

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
          caption="PDs/SPDs"
          .columns="${this.listColumns}"
          .items="${this.listData.length ? this.listData : [{}]}"
          .paginator="${this.paginator}"
          .getChildRowTemplateMethod="${this.listData.length ? this.getRowDetails : null}"
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

  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'number',
      link_tmpl: `${ROOT_PATH}interventions/:id/details`,
      type: EtoolsTableColumnType.Link,
      sort: null
    },
    {
      label: 'Partner Org Name',
      name: 'partner_name',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: 'Doc Type',
      name: 'document_type',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: 'Status',
      name: 'status',
      type: EtoolsTableColumnType.Text,
      capitalize: true,
      sort: null
    },
    {
      label: 'Title',
      name: 'title',
      type: EtoolsTableColumnType.Text,
      sort: null
    },
    {
      label: 'Start Date',
      name: 'start',
      type: EtoolsTableColumnType.Date,
      sort: null
    },
    {
      label: 'End Date',
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
      this.filters = null;
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
              <div class="detail">${item.budget_currency || ''} ${item.total_budget}</div>
            </div>
            <div>
              <div class="title">UNICEF Cache Contribution</div>
              <div class="detail">${item.budget_currency || ''} ${item.cso_contribution}</div>
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
      if (intervention.hasOwnProperty('status') && intervention.status === 'draft') {
        intervention.status = 'development';
      }
    });
  }

  private initFiltersForDisplay(state: RootState) {
    if (!this.filters && this.dataRequiredByFiltersHasBeenLoaded(state)) {
      const availableFilters = [...defaultFilters];
      this.populateDropdownFilterOptionsFromCommonData(state.commonData, availableFilters);

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
      this.routeDetails!.queryParams &&
      Object.keys(this.routeDetails!.queryParams).length > 0
    );
  }

  private populateDropdownFilterOptionsFromCommonData(commonData: any, currentFilters: EtoolsFilter[]) {
    updateFilterSelectionOptions(currentFilters, 'partners', commonData.partners);
    updateFilterSelectionOptions(currentFilters, 'status', commonData.interventionStatuses);
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
    if (!currentParams.page_size || !currentParams.status) {
      this.updateCurrentParams({
        page_size: '20',
        status: ['draft', 'active']
      });
      return false;
    } else {
      return true;
    }
  }
}
