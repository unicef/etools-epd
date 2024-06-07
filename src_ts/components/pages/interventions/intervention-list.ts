import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {RootState, store} from '../../../redux/store';

import '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header-slotted-styles';

import '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {
  updateFilterSelectionOptions,
  updateFiltersSelectedValues
} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import '@unicef-polymer/etools-unicef/src/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '@unicef-polymer/etools-unicef/src/etools-table/etools-table';
import {
  EtoolsPaginator,
  defaultPaginator
} from '@unicef-polymer/etools-unicef/src/etools-table/pagination/etools-pagination';
import {
  buildUrlQueryString,
  getSortFields,
  getUrlQueryStringSort
} from '@unicef-polymer/etools-modules-common/dist/layout/etools-table/etools-table-utility';

import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import get from 'lodash-es/get';
import './intervention-tab-pages/common/layout/export-intervention-data';
import {ListHelper, ListHelperResponse} from '@unicef-polymer/etools-modules-common/dist/list/list-helper';
import {
  InterventionsListStyles,
  InterventionsTableStyles
} from '@unicef-polymer/etools-modules-common/dist/list/list-styles';
import {addCurrencyAmountDelimiter} from '@unicef-polymer/etools-unicef/src/utils/currency';
import {notHiddenPartnersSelector} from '../../../redux/reducers/common-data';
import {translate, get as getTranslation} from 'lit-translate';
import {
  InterventionListData,
  LabelAndValue,
  GenericObject,
  RouteDetails,
  RouteQueryParams,
  EtoolsUser
} from '@unicef-polymer/etools-types';
import pick from 'lodash-es/pick';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {getInterventionFilters, InterventionFilterKeys, translateFilters} from './interventions-filters';
import {sharedStyles} from '@unicef-polymer/etools-modules-common/dist/styles/shared-styles-lit';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {setShouldReGetList} from './intervention-tab-pages/common/actions/interventions';
import {getTranslatedValue} from '@unicef-polymer/etools-modules-common/dist/utils/language';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-list')
export class InterventionList extends connect(store)(LitElement) {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, pageContentHeaderSlottedStyles, InterventionsListStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        .col_type {
          white-space: pre-line !important;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">${translate('INTERVENTIONS_LIST.PD_LIST')}</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <div class="action">
            <export-intervention-data
              .exportLinks="${this.exportLinks}"
              .params="${this.exportParams}"
              raised
              hidden
            ></export-intervention-data>
          </div>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters
          .filters="${this.filters}"
          @filter-change="${this.filtersChange}"
          .textFilters="${translate('GENERAL.FILTERS')}"
          .textClearAll="${translate('GENERAL.CLEAR_ALL')}"
        ></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading .active="${this.showLoading}"></etools-loading>
        <etools-table
          caption="${translate('INTERVENTIONS_LIST.TABLE_TITLE')}"
          .columns="${this.listColumns}"
          .items="${this.listData}"
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

  @property({type: Object})
  user!: EtoolsUser;

  @property({type: Array})
  exportLinks = [
    {name: translate('GENERAL.EXPORT_XLS'), type: 'xlsx'},
    {name: translate('GENERAL.EXPORT_CSV'), type: 'csv'}
  ];

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  interventionStatuses!: LabelAndValue[];

  @property({type: Number})
  commonDataLoadedTimestamp = 0;

  /**
   * Used to preserve previously selected filters and pagination when navigating away from the list and comming back
   */
  @property({type: Object})
  prevQueryStringObj!: GenericObject;

  listColumns: EtoolsTableColumn[] = [
    {
      label: translate('INTERVENTIONS_LIST.REFERENCE_NO') as unknown as string,
      name: 'number',
      link_tmpl: `${Environment.basePath}interventions/:id/metadata`,
      type: EtoolsTableColumnType.Link,
      sort: true
    },
    {
      label: translate('INTERVENTIONS_LIST.PARTNER_ORG_NAME') as unknown as string,
      name: 'partner_name',
      type: EtoolsTableColumnType.Text,
      sort: true
    },
    {
      label: translate('INTERVENTIONS_LIST.DOC_TYPE') as unknown as string,
      name: 'document_type',
      type: EtoolsTableColumnType.Custom,
      sort: true,
      customMethod: (item: any, _key: string) => {
        return item.document_type ? translate(`ITEM_TYPE.${item.document_type.toUpperCase()}`) : item.document_type;
      }
    },
    {
      label: translate('INTERVENTIONS_LIST.STATUS') as unknown as string,
      name: 'status',
      type: EtoolsTableColumnType.Custom,
      capitalize: true,
      sort: true,
      customMethod: (item: any, _key: string) => {
        const translatedStatus = item.status ? translate(`PD_STATUS.${item.status.toUpperCase()}`) : item.status;
        if (item.status !== 'development') {
          return translatedStatus;
        }
        if (item.partner_accepted && item.unicef_accepted) {
          return html`${translatedStatus} <br />
            ${translate('PARTNER_AND_UNICEF_ACCEPTED')}`;
        }
        if (!item.partner_accepted && item.unicef_accepted) {
          return html`${translatedStatus} <br />
            ${translate('UNICEF_ACCEPTED')}`;
        }
        if (item.partner_accepted && !item.unicef_accepted) {
          return html`${translatedStatus} <br />
            ${translate('PARTNER_ACCEPTED')}`;
        }
        if (!item.unicef_court && !!item.date_sent_to_partner) {
          return html`${translatedStatus} <br />
            ${translate('SENT_TO_PARTNER')}`;
        }

        if (item.unicef_court && !!item.submission_date && !!item.date_sent_to_partner) {
          return html`${translatedStatus} <br />
            ${translate('SENT_TO_UNICEF')}`;
        }
        return translatedStatus;
      },
      cssClass: 'col_type'
    },
    {
      label: translate('INTERVENTIONS_LIST.TITLE') as unknown as string,
      name: 'title',
      type: EtoolsTableColumnType.Text,
      sort: true
    },
    {
      label: translate('INTERVENTIONS_LIST.START_DATE') as unknown as string,
      name: 'start',
      type: EtoolsTableColumnType.Date,
      sort: true
    },
    {
      label: translate('INTERVENTIONS_LIST.END_DATE') as unknown as string,
      name: 'end',
      type: EtoolsTableColumnType.Date,
      sort: true
    }
  ];

  private listHelper = new ListHelper<InterventionListData>(etoolsEndpoints.interventions, store);
  private routeDetails!: RouteDetails | null;
  private paramsInitialized = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.getListData = debounce(this.getListData.bind(this), 400) as any;
  }

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
    if (!(routeDetails?.routeName === 'interventions' && routeDetails?.subRouteName === 'list')) {
      this.paramsInitialized = false;
      this.routeDetails = null;
      return; // Avoid code execution while on a different page
    }

    if (state.user && state.user.data && JSON.stringify(this.user) !== JSON.stringify(state.user.data)) {
      this.user = state.user.data;
    }

    const stateRouteDetails = {...state.app!.routeDetails};
    if (
      JSON.stringify(stateRouteDetails) !== JSON.stringify(this.routeDetails) ||
      state.interventions?.shouldReGetList
    ) {
      if (
        (!stateRouteDetails.queryParams || Object.keys(stateRouteDetails.queryParams).length === 0) &&
        this.prevQueryStringObj
      ) {
        this.routeDetails = stateRouteDetails;
        this.updateCurrentParams(this.prevQueryStringObj);
        return;
      }

      this.onParamsChange(stateRouteDetails, state.interventions?.shouldReGetList);
    }

    if (state.user && state.user.permissions) {
      this.canExport = state.user.permissions.canExport;
    }

    if (this.commonDataLoadedTimestamp !== state.commonData!.loadedTimestamp && this.filters) {
      // static data reloaded (because of language change), need to update filters
      this.commonDataLoadedTimestamp = state.commonData!.loadedTimestamp;
      translateFilters(this.filters);
      this.populateDropdownFilterOptionsFromCommonData(state, this.filters);
      this.filters = [...this.filters];
    }

    this.initFiltersForDisplay(state);
  }

  onParamsChange(routeDetails: RouteDetails, forceReGet: boolean): void {
    this.routeDetails = routeDetails;
    const currentParams: GenericObject<any> = this.routeDetails?.queryParams || {};
    const paramsValid: boolean = this.paramsInitialized || this.initializeAndValidateParams(currentParams);

    if (paramsValid) {
      // get data as params are valid
      this.showLoading = true;
      this.getListData(forceReGet);
    }
  }

  getRowDetails(item: InterventionListData): {rowHTML: TemplateResult} {
    return {
      rowHTML: html`
        <td colspan="8">
          <div class="details">
            <div>
              <div class="title">${translate('INTERVENTIONS_LIST.TOTAL_BUDGET')}</div>
              <div class="detail">${item.budget_currency || ''} ${addCurrencyAmountDelimiter(item.total_budget)}</div>
            </div>
            <div>
              <div class="title">${translate('INTERVENTIONS_LIST.UNICEF_CASH_CONTRIBUTION')}</div>
              <div class="detail">${item.budget_currency || ''} ${addCurrencyAmountDelimiter(item.unicef_cash)}</div>
            </div>
          </div>
        </td>
      `
    };
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
    if (JSON.stringify(currentParams) === JSON.stringify(newParams)) {
      return;
    }

    this.prevQueryStringObj = newParams;
    const stringParams: string = buildUrlQueryString(newParams);
    this.exportParams = stringParams;
    EtoolsRouter.replaceAppLocation(`${this.routeDetails!.path}?${stringParams}`);
  }

  private async getListData(forceReGet: boolean) {
    if (!this.user || !this.user.organization) {
      // do not load list data if user don't have organization
      this.showLoading = false;
      return;
    }
    const currentParams: GenericObject<any> = this.routeDetails!.queryParams || {};
    try {
      const {list, paginator}: ListHelperResponse<InterventionListData> = await this.listHelper.getList(
        currentParams,
        forceReGet
      );
      this.listData = list;
      // remove this after status draft comes as development
      this.mapDraftToDevelop(this.listData);
      // update paginator (total_pages, visible_range, count...)
      this.paginator = paginator;
      this.showLoading = false;
      store.dispatch(setShouldReGetList(false));
    } catch (error: any) {
      this.showLoading = false;

      // Request aborted, prevent showing toast errors
      if (error.status === 0) {
        return;
      }

      console.error('[EtoolsInterventionsList]: get Interventions req error...', error);
      fireEvent(this, 'toast', {text: getTranslation('ERROR_LOADING_DATA')});
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
      this.commonDataLoadedTimestamp = state.commonData!.loadedTimestamp;
      const availableFilters = [...getInterventionFilters()];
      this.populateDropdownFilterOptionsFromCommonData(state, availableFilters);

      // update filter selection and assign the result to etools-filters(trigger render)
      const currentParams: RouteQueryParams = state.app!.routeDetails.queryParams || {};
      this.filters = updateFiltersSelectedValues(currentParams, availableFilters);
    }
  }

  private dataRequiredByFiltersHasBeenLoaded(state: RootState): boolean {
    return !!(
      state.commonData?.loadedTimestamp &&
      this.routeDetails?.queryParams &&
      Object.keys(this.routeDetails?.queryParams).length > 0
    );
  }

  private populateDropdownFilterOptionsFromCommonData(state: RootState, currentFilters: EtoolsFilter[]) {
    updateFilterSelectionOptions(currentFilters, 'partners', notHiddenPartnersSelector(state));
    updateFilterSelectionOptions(
      currentFilters,
      'status',
      state.commonData!.interventionStatuses.map((x: any) => ({
        ...x,
        label: getTranslatedValue(x.label, 'PD_STATUS')
      }))
    );
    updateFilterSelectionOptions(
      currentFilters,
      'document_type',
      state.commonData!.documentTypes.map((x: any) => ({
        ...x,
        label: getTranslatedValue(x.label, 'ITEM_TYPE')
      }))
    );
    updateFilterSelectionOptions(currentFilters, InterventionFilterKeys.editable_by, [
      {label: getTranslation('UNICEF'), value: 'unicef'},
      {label: getTranslation('PARTNER'), value: 'partner'}
    ]);
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
      // prevQueryStringObj store page previous filtering params, if set, apply them to preserve user filters selection
      this.updateCurrentParams(
        this.prevQueryStringObj
          ? this.prevQueryStringObj
          : {
              page_size: '25',
              status: ['draft', 'review', 'signature', 'signed', 'active']
            }
      );
      return false;
    } else {
      // store existing url params in prevQueryStringObj property, to be used on navigation to PD list as default params
      this.prevQueryStringObj = currentParams;
      return true;
    }
  }
}
