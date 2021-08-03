import {LitElement, customElement, html, property} from 'lit-element';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {InterventionsListStyles, InterventionsTableStyles} from '../../common/list/list-styles';
import {translate} from 'lit-translate';
import {GenericObject, InterventionListData, RouteDetails, RouteQueryParams} from '@unicef-polymer/etools-types';
import {defaultPaginator, EtoolsPaginator} from '@unicef-polymer/etools-table/pagination/etools-pagination';
import {EtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '@unicef-polymer/etools-table/etools-table';
import {ROOT_PATH} from '../../../../config/config';
import {ListHelper, ListHelperResponse} from '../../common/list/list-helper';
import {RootState, store} from '../../../../redux/store';
import get from 'lodash-es/get';
import '../../../common/layout/page-content-header/page-content-header';
import {
  buildUrlQueryString,
  getSortFields,
  getUrlQueryStringSort
} from '../../../common/layout/etools-table/etools-table-utility';
import pick from 'lodash-es/pick';
import {replaceAppLocation} from '../../../../routing/routes';
import {updateFiltersSelectedValues} from '../../common/list/filters';
import {etoolsEndpoints} from '../../../../endpoints/endpoints-list';
import {connect} from 'pwa-helpers/connect-mixin';
import {defaultFilters} from './eface-filters';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {pageLayoutStyles} from '../../common/styles/page-layout-styles';

/**
 * @customElement
 */
@customElement('eface-list')
export class EfaceList extends connect(store)(LitElement) {
  static get styles() {
    return [elevationStyles, buttonsStyles, pageLayoutStyles, pageContentHeaderSlottedStyles, InterventionsListStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <style>
        ${sharedStyles} .col_type {
          white-space: pre-line !important;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title" style="text-transform:none">eFace Forms List</h1>
        <div slot="title-row-actions" class="content-header-actions">
          <paper-button class="primary" @tap="${this.goToNewEface}" ?hidden="${this.isUnicefUser}">
            <iron-icon icon="add"></iron-icon>
            Add New eFace Form
          </paper-button>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}" @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>
        <etools-table
          caption="Forms"
          .columns="${this.listColumns}"
          .items="${this.listData.length ? this.listData : [{}]}"
          .paginator="${this.paginator}"
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
  showLoading = false;

  @property({type: Object})
  urlParams!: GenericObject;

  @property({type: Boolean})
  isUnicefUser?: boolean;

  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'reference_number',
      link_tmpl: `${ROOT_PATH}eface/:id/details`,
      type: EtoolsTableColumnType.Link,
      sort: null
    },
    {
      label: 'PD/SPD',
      name: 'intervention_reference_number',
      link_tmpl: `${ROOT_PATH}interventions/:intervention/metadata`,
      type: EtoolsTableColumnType.Link,
      sort: null
    },
    {
      label: (translate('INTERVENTIONS_LIST.STATUS') as unknown) as string,
      name: 'status',
      type: EtoolsTableColumnType.Text,
      capitalize: true,
      sort: null,
      cssClass: 'col_type'
    }
  ];

  private listHelper = new ListHelper(etoolsEndpoints.efaceForms);
  private routeDetails!: RouteDetails | null;
  private paramsInitialized = false;

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
    if (!(routeDetails.routeName === 'eface' && routeDetails.subRouteName === 'list')) {
      this.paramsInitialized = false;
      this.routeDetails = null;
      return; // Avoid code execution while on a different page
    }

    this.isUnicefUser = state.user?.data?.is_unicef_user;

    const stateRouteDetails = {...state.app!.routeDetails};
    if (
      JSON.stringify(stateRouteDetails) !== JSON.stringify(this.routeDetails) ||
      state.interventions?.shouldReGetList
    ) {
      if (
        (!stateRouteDetails.queryParams || Object.keys(stateRouteDetails.queryParams).length === 0) &&
        this.urlParams
      ) {
        this.routeDetails = stateRouteDetails;
        this.updateCurrentParams(this.urlParams);
        return;
      }

      this.onParamsChange(stateRouteDetails, state.interventions?.shouldReGetList);
    }

    this.initFiltersForDisplay(state);
  }

  onParamsChange(routeDetails: RouteDetails, forceReGet: boolean): void {
    this.routeDetails = routeDetails;
    const currentParams: GenericObject<any> = this.routeDetails?.queryParams || {};
    const paramsValid: boolean = this.paramsInitialized || this.initializeAndValidateParams(currentParams);

    if (paramsValid) {
      // get data as params are valid
      this.getListData(forceReGet);
    }
  }

  filtersChange(e: CustomEvent) {
    this.updateCurrentParams({...e.detail, page: 1}, true);
  }

  paginatorChange(e: CustomEvent) {
    const {page, page_size}: EtoolsPaginator = e.detail;
    this.updateCurrentParams({page, page_size});
  }

  sortChange(e: CustomEvent) {
    const sort = getSortFields(e.detail);
    this.updateCurrentParams({sort: getUrlQueryStringSort(sort)});
  }

  private updateCurrentParams(paramsToUpdate: GenericObject<any>, reset = false): void {
    let currentParams: RouteQueryParams = this.routeDetails!.queryParams || {};
    if (reset) {
      currentParams = pick(currentParams, ['sort', 'page_size']);
    }
    const newParams: RouteQueryParams = {...currentParams, ...paramsToUpdate};
    this.urlParams = newParams;
    const stringParams: string = buildUrlQueryString(newParams);
    replaceAppLocation(`${this.routeDetails!.path}?${stringParams}`);
  }

  private async getListData(forceReGet: boolean) {
    const currentParams: GenericObject<any> = this.routeDetails!.queryParams || {};
    try {
      this.showLoading = true;
      const {list, paginator}: ListHelperResponse<any> = await this.listHelper.getList(currentParams, forceReGet);
      this.listData = list;
      // update paginator (total_pages, visible_range, count...)
      this.paginator = paginator;
      this.showLoading = false;
    } catch (error) {
      console.error('[EtoolsEfaceFormsList]: get forms req error...', error);
    }
  }

  private initFiltersForDisplay(state: RootState) {
    const availableFilters = [...defaultFilters];

    // update filter selection and assign the result to etools-filters(trigger render)
    const currentParams: RouteQueryParams = state.app!.routeDetails.queryParams || {};
    this.filters = updateFiltersSelectedValues(currentParams, availableFilters);
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
              page_size: '20'
            }
      );
      return false;
    } else {
      // store existing url params in urlParams property, to be used on navigation to PD list as default params
      this.urlParams = currentParams;
      return true;
    }
  }

  goToNewEface() {
    history.pushState(window.history.state, '', `${ROOT_PATH}eface/new/`);
    window.dispatchEvent(new CustomEvent('popstate'));
  }
}
