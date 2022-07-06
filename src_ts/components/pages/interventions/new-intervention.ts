import {customElement, html, LitElement, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {sharedStyles} from '@unicef-polymer/etools-modules-common/dist/styles/shared-styles-lit';
import '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header';
import {translate} from 'lit-translate/directives/translate';
import ComponentBaseMixin from '@unicef-polymer/etools-modules-common/dist/mixins/component-base-mixin';
import '@polymer/paper-input/paper-input';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {buttonsStyles} from '@unicef-polymer/etools-modules-common/dist/styles/button-styles';
import {ROOT_PATH} from '@unicef-polymer/etools-modules-common/dist/config/config';
import {EtoolsRequestEndpoint, sendRequest} from '@unicef-polymer/etools-ajax';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import {fireEvent} from '@unicef-polymer/etools-modules-common/dist/utils/fire-custom-event';
import {areEqual} from '@unicef-polymer/etools-modules-common/dist/utils/utils';
import {formatDate} from '@unicef-polymer/etools-modules-common/dist/utils/date-utils';
import {User} from '@unicef-polymer/etools-types';
import './intervention-tab-pages/common/components/intervention/partner-focal-points';

@customElement('new-intervention')
export class NewIntervention extends ComponentBaseMixin(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  public render() {
    return html`
      ${sharedStyles}
      <style>
        .container {
          margin: 24px;
        }
        .card {
          padding: 16px;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">Add Concept Note</h1>
      </page-content-header>
      <div class="container">
        <etools-content-panel panel-title="Enter Initial Details">
          <div class="row-padding">
            <!--   Partner   -->
            <div class="col-12">
              <paper-input
                id="partner"
                label="Partner Organization"
                char-counter
                maxlength="256"
                placeholder="&#8212;"
                required
                error-message="${translate('THIS_FIELD_IS_REQUIRED')}"
                .value="${this.data?.partner}"
                @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail, 'partner')}"
                @focus="${this.resetError}"
                @click="${this.resetError}"
              ></paper-input>
            </div>
          </div>
          <div class="row-padding">
            <div class="col-6">
              <label class="paper-label">Partner Focal Points</label>
              <partner-focal-points
                ?onAddPage="${true}"
                .user="${this.user}"
                @items-changed="${(e: CustomEvent) => {
                  if (!areEqual(e.detail.items, this.data.partner_focal_points)) {
                    this.data.partner_focal_points = e.detail.items;
                    this.requestUpdate;
                  }
                }}"
              ></partner-focal-points>
            </div>
          </div>

          <div class="row-h">
            <!-- Start Date -->
            <div class="col-3">
              <datepicker-lite
                id="startDate"
                label="Start Date (Estimated)"
                .value="${this.data?.start}"
                fire-date-has-changed
                @date-has-changed="${({detail}: CustomEvent) =>
                  this.setInterventionField('start', formatDate(detail.date, 'YYYY-MM-DD'))}"
                selected-date-display-format="D MMM YYYY"
              >
              </datepicker-lite>
            </div>
            <!-- End Date -->
            <div class="col-3">
              <datepicker-lite
                id="endDate"
                label="End Date (Estimated)"
                .value="${this.data?.end}"
                fire-date-has-changed
                @date-has-changed="${({detail}: CustomEvent) =>
                  this.setInterventionField('end', formatDate(detail.date, 'YYYY-MM-DD'))}"
                selected-date-display-format="D MMM YYYY"
              >
              </datepicker-lite>
            </div>
          </div>
          <div class="row-padding">
            <!--   Document Title   -->
            <div class="col-12">
              <paper-input
                id="title"
                label="Document Title"
                char-counter
                maxlength="256"
                placeholder="&#8212;"
                required
                error-message="${translate('THIS_FIELD_IS_REQUIRED')}"
                .value="${this.data?.title}"
                @value-changed="${({detail}: CustomEvent) =>
                  this.setInterventionField('title', detail && detail.value)}"
                @focus="${this.resetError}"
                @click="${this.resetError}"
              ></paper-input>
            </div>
          </div>

          <div class="row-padding">${this.renderActions(true, true)}</div>
        </etools-content-panel>
      </div>
    `;
  }

  @property({type: Object})
  user!: User;

  @property({type: Object})
  data: any = {};

  connectedCallback() {
    super.connectedCallback();
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'interv-page'
    });
  }

  resetError(event: any): void {
    event.target.invalid = false;
  }

  setInterventionField(field: any, value: any): void {
    if (value === undefined) {
      return;
    }

    if (areEqual(this.data[field], value)) {
      return;
    }
    // @ts-ignore
    this.data[field] = value;
    this.requestUpdate();
  }

  saveData(): Promise<any> {
    if (!this.validate()) {
      return Promise.resolve(false);
    }
    return sendRequest({
      endpoint: etoolsEndpoints.interventions as EtoolsRequestEndpoint,
      method: 'POST',
      body: this.data
    })
      .then((response: any) => this.goToSavedPD(response.id))
      .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this));
  }

  goToSavedPD(id: string) {
    history.pushState(window.history.state, '', `${ROOT_PATH}interventions/${id}/metadata`);
    window.dispatchEvent(new CustomEvent('popstate'));
  }
}
