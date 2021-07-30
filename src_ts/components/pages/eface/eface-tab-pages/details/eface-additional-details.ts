import {LitElement, TemplateResult, html, customElement, css, property} from 'lit-element';
import '@polymer/paper-checkbox/paper-checkbox';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '@polymer/paper-input/paper-textarea';
import {RootState, store} from '../../../../../redux/store';
import {currentPage, currentSubpage} from '../../../interventions/intervention-tab-pages/common/selectors';
import {Eface} from '../types';
import {User} from '@unicef-polymer/etools-types';
import {PaperCheckboxElement} from '@polymer/paper-checkbox/paper-checkbox';
import {areEqual, cloneDeep} from '../../../common/utils/utils';
import {connect} from 'pwa-helpers/connect-mixin';
import {formatDate} from '../../../common/utils/date-utils';
import {translate} from 'lit-translate';
import {getEndpoint} from '../../../common/utils/endpoint-helper';
import {etoolsEndpoints} from '../../../../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {buttonsStyles} from '../../../common/styles/button-styles';
import {sharedStyles} from '../../../common/styles/shared-styles-lit';
import {setEfaceForm} from '../../../../../redux/actions/eface-forms';
import {fireEvent} from '../../../common/utils/fire-custom-event';
import '@unicef-polymer/etools-loading/etools-loading';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';

@customElement('eface-additional-details')
export class EfaceAdditionalDetails extends connect(store)(LitElement) {
  static get styles() {
    // language=css
    return [
      elevationStyles,
      buttonsStyles,
      css`
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 47px;
          padding: 0 24px;
          border-bottom: 1px groove var(--dark-divider-color);
        }
        .section-header > h2 {
          font-size: 18px;
        }
        :host section {
          padding: 0;
          background-color: var(--primary-background-color);
          position: relative;
        }
        .content {
          padding: 24px;
        }
        .checkboxes {
          padding-left: 24px;
        }
        paper-checkbox {
          display: flex;
          align-items: flex-start;
          margin-top: 16px;
        }
        .block {
          display: flex;
          align-items: center;
          margin-top: 24px;
        }
        etools-dropdown {
          margin: 0 24px;
        }
        etools-dropdown,
        .flex-1 {
          flex: 1;
        }
        .flex-2 {
          flex: 2;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 24px 24px;
        }
        paper-checkbox[readonly] {
          pointer-events: none;
        }
      `
    ];
  }
  protected render(): TemplateResult {
    return html` <style>
        ${sharedStyles}
      </style>
      <section class="elevation form-info" elevation="1">
        <etools-loading .active="${this.loading}"></etools-loading>
        <div class="section-header">
          <h2>Certification</h2>
          <paper-icon-button
            ?hidden="${this.isReadonly}"
            icon="create"
            @click="${() => (this.editMode = true)}"
          ></paper-icon-button>
        </div>
        <div class="content">
          <div>
            The undersigned authorized officer of the above-mentioned implementing institution hereby certifies that:
          </div>
          <div class="checkboxes">
            <paper-checkbox
              data-field="request_represents_expenditures"
              ?checked="${this.eface?.request_represents_expenditures}"
              ?readonly="${!this.editMode || !this.efaceOriginal?.permissions.edit.request_represents_expenditures}"
              @checked-changed="${({target}: CustomEvent) =>
                this.setFormField(
                  Boolean((target as PaperCheckboxElement).checked),
                  'request_represents_expenditures'
                )}"
            >
              The funding request shown above represents estimated expenditures as per AWP and itemized cost estimated
              attached
            </paper-checkbox>
            <paper-checkbox
              data-field="expenditures_disbursed"
              ?checked="${this.eface?.expenditures_disbursed}"
              ?readonly="${!this.editMode || !this.efaceOriginal?.permissions.edit.expenditures_disbursed}"
              @checked-changed="${({target}: CustomEvent) =>
                this.setFormField(Boolean((target as PaperCheckboxElement).checked), 'expenditures_disbursed')}"
            >
              The actual expenditures for the period stated herein has been disbursed in accordance with the AWP and
              request with itemized cost estimates. The detailed accounting documents for these expenditures can be made
              available for examination, when required, for the period of five years from the date of the provision of
              funds.
            </paper-checkbox>
          </div>
          <div class="block">
            <datepicker-lite
              class="flex-1"
              data-field="submitted_by_unicef_date"
              label="Date Submitted"
              ?readonly="${!this.editMode || !this.efaceOriginal?.permissions.edit.submitted_by_unicef_date}"
              .value="${this.eface?.submitted_by_unicef_date}"
              selected-date-display-format="D MMM YYYY"
              fire-date-has-changed
              @date-has-changed="${(e: CustomEvent) => this.dateChanged(e)}"
            >
            </datepicker-lite>

            <!--   Submitted By   -->
            <etools-dropdown
              class="flex-2"
              label="Submitted By"
              data-field="submitted_by"
              ?readonly="${!this.editMode || !this.efaceOriginal?.permissions.edit.submitted_by}"
              placeholder="&#8212;"
              .options="${this.users}"
              .selected="${this.eface?.submitted_by?.id}"
              ?trigger-value-change-event="${this.editMode}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.setFormField(detail.selectedItem, 'submitted_by')}"
              option-value="id"
              option-label="name"
            >
            </etools-dropdown>
            <div class="flex-2">
              <div class="paper-label">Title</div>
              <div class="input-label">${this.eface?.submitted_by?.title || '-'}</div>
            </div>
          </div>
          <div class="block">
            <paper-textarea
              data-field="notes"
              label="Notes"
              ?readonly="${!this.editMode || !this.efaceOriginal?.permissions.edit.notes}"
              always-float-label
              class="w100"
              placeholder="&#8212;"
              max-rows="4"
              .value="${this.eface?.notes}"
              @value-changed="${({detail}: CustomEvent) => this.setFormField(detail.value, 'notes')}"
            ></paper-textarea>
          </div>
        </div>
        <div class="buttons" ?hidden="${!this.editMode}">
          <paper-button class="default" @click="${this.cancel}">${translate('GENERAL.CANCEL')}</paper-button>
          <paper-button class="primary" @click="${this.save}"> ${translate('GENERAL.SAVE')} </paper-button>
        </div>
      </section>`;
  }

  @property({type: Object}) eface!: Eface;
  @property({type: Array}) users!: User[];
  @property({type: Boolean}) editMode = false;
  @property({type: Boolean}) loading = false;
  @property({type: Boolean}) isReadonly = true;

  private efaceOriginal!: Eface;

  stateChanged(state: RootState) {
    if (currentPage(state) !== 'eface' || currentSubpage(state) !== 'details') {
      return;
    }
    this.eface = cloneDeep(state.eface.current);
    this.editMode = false;
    this.efaceOriginal = state.eface.current;
    this.users = state.commonData?.unicefUsersData || [];
    this.isReadonly = !this.canEditAtLeastOneField();
  }

  dateChanged({detail}: CustomEvent) {
    const newValue = detail.date ? formatDate(detail.date, 'YYYY-MM-DD') : null;
    this.setFormField(newValue, 'submitted_by_unicef_date');
  }

  setFormField(value: any, field: keyof Eface) {
    if (!this.eface || value === undefined || areEqual(this.eface[field], value)) {
      return;
    }
    (this.eface as any)[field] = value;
    this.requestUpdate();
  }

  cancel() {
    this.eface = cloneDeep(this.efaceOriginal);
    this.editMode = false;
  }

  save() {
    const data = Array.from(this.shadowRoot!.querySelectorAll('[data-field]')).reduce((data, element: Element) => {
      const fieldKey: keyof Eface = (element as HTMLElement).dataset.field as keyof Eface;
      const value =
        this.eface[fieldKey] && typeof this.eface[fieldKey] === 'object'
          ? this.eface[fieldKey].id
          : this.eface[fieldKey];
      return {
        ...data,
        [fieldKey]: value
      };
    }, {});
    this.loading = true;
    const endpoint = getEndpoint(etoolsEndpoints.efaceForm, {id: this.eface!.id});
    sendRequest({endpoint, method: 'PATCH', body: data})
      .then((form: Eface) => {
        this.editMode = false;
        this.loading = false;
        store.dispatch(setEfaceForm(form));
      })
      .catch((error) => {
        this.loading = false;
        fireEvent(this, 'toast', {text: `Can not save form.\n${formatServerErrorAsText(error)}`});
      });
  }

  private canEditAtLeastOneField(): boolean {
    return Array.from(this.shadowRoot!.querySelectorAll('[data-field]')).some((element: Element) => {
      const fieldKey: keyof Eface = (element as HTMLElement).dataset.field as keyof Eface;
      return Boolean(this.eface?.permissions.edit[fieldKey]);
    });
  }
}
