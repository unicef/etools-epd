import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {DataMixin} from '../../../common/mixins/data-mixin';
import {InterventionActivity} from '../../../common/models/intervention.types';
import {fireEvent} from '../../../../../../utils/fire-custom-event';
import '@unicef-polymer/etools-currency-amount-input';
import '@polymer/paper-input/paper-textarea';
import {gridLayoutStylesLit} from '../../../common/styles/grid-layout-styles-lit';

@customElement('activity-data-dialog')
export class ActivityDataDialog extends DataMixin()<InterventionActivity>(LitElement) {
  static get styles(): CSSResultArray {
    return [gridLayoutStylesLit];
  }
  @property() dialogOpened = true;
  @property() loadingInProcess = false;
  @property() isEditDialog = false;
  set dialogData({activity}: any) {
    this.data = activity;
  }

  protected render(): TemplateResult {
    // language=html
    return html`
      <style>
        etools-dialog {
          --etools-dialog-scrollable: {
            margin-top: 0 !important;
          }
          --etools-dialog-button-styles: {
            margin-top: 0 !important;
          }
        }
        .container {
          padding: 12px 24px;
        }
        *[hidden] {
          display: none;
        }
        etools-currency-amount-input {
          margin-right: 24px;
        }
        .total {
          justify-content: flex-end;
        }
        .total paper-input {
          --paper-input-container-color: transparent;
          --paper-input-container-focus-color: transparent;
        }
        paper-textarea {
          --paper-input-container-input: {
            display: block;
          }
        }
      </style>
      <etools-dialog
        size="md"
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        dialog-title="Activity Data"
        @confirm-btn-clicked="${() => this.processRequest()}"
        @close="${this.onClose}"
        .okBtnText="Save"
        no-padding
      >
        <etools-loading ?active="${this.loadingInProcess}" loading-text="Loading..."></etools-loading>
        <div class="container layout vertical">
          <paper-input
            class="validate-input flex-1"
            label="Activity name"
            placeholder="Enter Activity Name"
            .value="${this.editedData.name}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('name', detail.value)}"
            required
            ?invalid="${this.errors.activity_name}"
            .errorMessage="${this.errors.activity_name && this.errors.activity_name[0]}"
          ></paper-input>

          <paper-textarea
            class="validate-input flex-1"
            label="Other Notes"
            placeholder="Enter Other Notes"
            .value="${this.editedData.context_details}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('context_details', detail.value)}"
            ?invalid="${this.errors.context_details}"
            .errorMessage="${this.errors.context_details && this.errors.context_details[0]}"
          ></paper-textarea>

          <div class="layout-horizontal align-items-center">
            <etools-currency-amount-input
              class="col-2"
              label="CSO Cache Budget"
              .value="${this.editedData.cso_cash}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('cso_cash', detail.value)}"
            ></etools-currency-amount-input>

            <etools-currency-amount-input
              class="col-2"
              label="Unicef Cache Budget"
              .value="${this.editedData.unicef_cash}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('unicef_cash', detail.value)}"
            ></etools-currency-amount-input>

            <div class="flex-auto layout-horizontal total">
              <paper-input readonly class="col-4" label="Total" .value="${this.getTotalValue()}"></paper-input>
            </div>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  getTotalValue(): string {
    const total: number = (this.editedData.cso_cash || 0) + (this.editedData.unicef_cash || 0);
    return `${total}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  processRequest(): void {
    // if (this.unassociated || this.loadingInProcess) {
    //   return;
    // }
    // this.loadingInProcess = true;
    // // get endpoint
    // const endpoint: EtoolsRequestEndpoint = this.isEditDialog
    //   ? getEndpoint(interventionEndpoints.pdDetails, {id: this.editedData.id})
    //   : getEndpoint(interventionEndpoints.createPd);
    //
    // // get changed fields
    // const diff: Partial<ResultLinkLowerResult> = getDifference<ResultLinkLowerResult>(
    //   this.isEditDialog ? (this.originalData as ResultLinkLowerResult) : {},
    //   this.editedData,
    //   {
    //     toRequest: true
    //   }
    // );
    // sendRequest({
    //   endpoint,
    //   method: this.isEditDialog ? 'PATCH' : 'POST',
    //   body: this.isEditDialog ? {id: this.editedData.id, ...diff} : diff
    // })
    //   .then(() => {
    //     fireEvent(this, 'dialog-closed', {confirmed: true});
    //   })
    //   .catch((error) => {
    //     this.loadingInProcess = false;
    //     this.errors = (error && error.response) || {};
    //     fireEvent(this, 'toast', {text: 'Can not save PD Output!'});
    //   });
  }
}
