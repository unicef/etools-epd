import {customElement, html, LitElement} from 'lit-element';
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
            <!--   Creator   -->
            <div class="col-12">
              <paper-input
                id="creator"
                label="Partner Organization"
                char-counter
                maxlength="300"
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
          <div class="row-padding">${this.renderActions(true, true)}</div>
        </etools-content-panel>
      </div>
    `;
  }

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
