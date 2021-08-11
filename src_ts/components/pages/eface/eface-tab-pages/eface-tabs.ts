import {LitElement, customElement, html, property} from 'lit-element';
import '@polymer/paper-button/paper-button';
import {translate} from 'lit-translate';
import './details/eface-details';
import '../../etools-pages-common/layout/page-content-header/page-content-header';
import '../../etools-pages-common/layout/status/etools-status';
import '../eface-actions/eface-actions';
import {currentPage, currentSubpage} from '../../interventions/intervention-tab-pages/common/selectors';
import get from 'lodash-es/get';
import cloneDeep from 'lodash-es/cloneDeep';
import {getEfaceForm} from '../redux/actions/eface-forms';
import {RootState} from '../../../../redux/store';
import {
  BASIC_STATUSES,
  CANCELLED,
  CANCELLED_STATUSES,
  CLOSED,
  CLOSED_STATUSES,
  REJECTED,
  REJECTED_STATUSES
} from '../eface-actions/actions-and-statuses';
import {Eface} from './types';
import '../../etools-pages-common/components/cancel/reason-display';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {isJsonStrMatch} from '../../etools-pages-common/utils/utils';
import {fireEvent} from '../../etools-pages-common/utils/fire-custom-event';
import {pageContentHeaderSlottedStyles} from '../../etools-pages-common/layout/page-content-header/page-content-header-slotted-styles';
import {getStore} from '../../etools-pages-common/utils/redux-store-access';
import {efaceInterventions} from '../redux/reducers/eface-interventions';
import {eface} from '../redux/reducers/eface-forms';
import {connectStore} from '../../etools-pages-common/mixins/connect-store-mixin';

/**
 * @customElement
 */
@customElement('eface-tabs')
export class EfaceTabs extends connectStore(LitElement) {
  static get styles() {
    return [pageContentHeaderSlottedStyles, pageLayoutStyles];
  }
  render() {
    // language=HTML
    return html`
      <style></style>
      <etools-status-lit
        .statuses="${this.statuses}"
        .activeStatus="${this.eface?.status || 'draft'}"
        .rejectStatuses="${[REJECTED, CLOSED, CANCELLED]}"
      ></etools-status-lit>
      <page-content-header with-tabs-visible>
        <span slot="page-title">${this.eface?.reference_number}</span>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button @click="${this.export}" id="export">
            <iron-icon icon="file-download" class="export-icon"></iron-icon>
            ${translate('EXPORT')}
          </paper-button>
          <eface-actions
            .entityId="${this.eface?.id}"
            .actions="${this.eface?.actions_available || []}"
          ></eface-actions>
        </div>

        <div slot="tabs"></div>
      </page-content-header>
      <div class="page-content">
        ${this.eface?.cancel_reason ||
        (this.eface?.rejection_reason && ['rejected', 'closed'].includes(this.eface.status))
          ? html`<reason-display
              .justification=${this.eface?.cancel_reason ? this.eface.cancel_reason : this.eface?.rejection_reason}
              .title="${this.eface.rejection_reason ? translate('REJECTION_NOTE') : translate('CANCELLATION_NOTE')}"
            ></reason-display>`
          : ''}
        <eface-details></eface-details>
      </div>
    `;
  }

  @property({type: Object})
  eface: Eface | null = null;

  @property({type: Array})
  statuses: string[][] = [];

  connectedCallback() {
    super.connectedCallback();
  }

  getLazyReducers() {
    return {
      efaceInterventions,
      eface
    };
  }

  public stateChanged(state: RootState) {
    const notEfaceTabs: boolean =
      currentPage(state) !== 'eface' || currentSubpage(state) === 'list' || currentSubpage(state) === 'new';
    if (notEfaceTabs && this.eface) {
      this.eface = null;
    }
    if (notEfaceTabs || state.eface?.formLoading) {
      return;
    }

    const currentEfaceId = get(state, 'app.routeDetails.params.efaceId');
    const currentEface = get(state, 'eface.current');

    // check if eface was changed
    if (currentEface && !isJsonStrMatch(this.eface, currentEface)) {
      this.eface = cloneDeep(currentEface);
      this.setStatuses(this.eface!.status);
    }

    // check if we need to load eface
    if (Number(currentEfaceId) !== Number(this.eface?.id)) {
      fireEvent(this, 'global-loading', {
        active: true,
        loadingSource: 'get-eface'
      });

      getStore()
        .dispatch(getEfaceForm(currentEfaceId))
        .catch(() => this.goToPageNotFound())
        .finally(() => {
          fireEvent(this, 'global-loading', {
            active: false,
            loadingSource: 'get-eface'
          });
        });
    }
  }

  export() {
    console.log('NOT IMPLEMENTED');
  }

  goToPageNotFound() {
    history.pushState(window.history.state, '', 'page-not-found');
    window.dispatchEvent(new CustomEvent('popstate'));
  }

  private setStatuses(status: string): void {
    switch (status) {
      case CANCELLED:
        this.statuses = CANCELLED_STATUSES;
        return;
      case REJECTED:
        this.statuses = REJECTED_STATUSES;
        return;
      case CLOSED:
        this.statuses = CLOSED_STATUSES;
        return;
      default:
        this.statuses = BASIC_STATUSES;
    }
  }
}
