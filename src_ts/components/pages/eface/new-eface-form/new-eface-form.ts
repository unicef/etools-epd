import {customElement, LitElement, html, CSSResultArray, css, property} from 'lit-element';
import {GenericObject, Intervention} from '@unicef-polymer/etools-types';
import '@unicef-polymer/etools-dropdown';
import '@polymer/paper-input/paper-input';
import {RootState, store} from '../../../../redux/store';
import {etoolsEndpoints} from '../../../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {ROOT_PATH} from '../../../../config/config';
import {setEfaceForm} from '../redux/actions/eface-forms';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import {RequiredFieldsStyles} from '@unicef-polymer/etools-modules-common/dist/styles/required-fields-styles';
import {areEqual} from '@unicef-polymer/etools-modules-common/dist/utils/utils';
import {fireEvent} from '@unicef-polymer/etools-modules-common/dist/utils/fire-custom-event';
import {EfaceFormTypes} from '../eface-utils/eface.constants';
import {efaceInterventions} from '../redux/reducers/eface-interventions';
import {eface} from '../redux/reducers/eface-forms';
import {Store} from 'redux';
import {getStoreAsync} from '@unicef-polymer/etools-modules-common/dist/utils/redux-store-access';
import {getEfaceInterventions} from '../redux/actions/eface-interventions';
import {connectStore} from '@unicef-polymer/etools-modules-common/dist/mixins/connect-store-mixin';

@customElement('new-eface-form')
export class NewEfaceForm extends connectStore(LitElement) {
  static get styles(): CSSResultArray {
    // language=css
    return [
      css`
        :host {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        header {
          flex: none;
          padding: 30px 48px;
          background-color: var(--primary-background-color);
          border-bottom: 1px solid var(--darker-divider-color);
        }
        h1 {
          font-size: 24px;
          font-weight: normal;
          margin: 0;
        }
        main {
          flex: 1;
          min-width: 0;
          position: relative;
          display: block;
          background-color: var(--primary-background-color);
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);
          border-radius: 2px;
          padding-bottom: 24px;
          margin: 24px;
        }
        .row {
          position: relative;
          display: flex;
          padding: 3px 24px;
        }
        .row:first-child {
          padding-top: 0;
        }
        .row:last-child {
          padding-bottom: 0;
        }
        paper-input {
          width: 100%;
        }
        etools-dropdown:not(:first-child) {
          margin-left: 24px;
        }
        .title {
          height: 50px;
          padding: 0px 35px;
          border-bottom: 1px solid var(--dark-divider-color);
          font-weight: 500;
          font-size: 18px;
          line-height: 50px;
          color: var(--dark-primary-text-color);
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 10px;
        }
        paper-button {
          background-color: var(--light-disabled-text-color);
          padding: 8px 20px;
          margin-left: 24px;
        }

        .primary-btn {
          background-color: var(--default-primary-color);
          color: #ffffff;
        }
      `
    ];
  }
  protected render(): unknown {
    return html`
      ${RequiredFieldsStyles}
      <header><h1>Add new EFace Form</h1></header>
      <main>
        <div class="title">Enter initial details</div>
        <div class="row">
          <!--   Intervention   -->
          <etools-dropdown
            id="intervention"
            label="Intervention"
            required
            placeholder="&#8212;"
            .options="${this.interventions}"
            .selected="${this.newForm.intervention}"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.setFormField('intervention', detail.selectedItem && detail.selectedItem.id)}"
            option-value="id"
            option-label="title"
            @focus="${this.resetError}"
            @click="${this.resetError}"
          >
          </etools-dropdown>

          <!--   Type   -->
          <etools-dropdown
            id="type"
            label="Type"
            required
            hide-search
            placeholder="&#8212;"
            .options="${this.types}"
            .selected="${this.newForm.type}"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.setFormField('request_type', detail.selectedItem?.value)}"
            option-value="value"
            option-label="label"
            @focus="${this.resetError}"
            @click="${this.resetError}"
          >
          </etools-dropdown>
        </div>
        <div class="row buttons">
          <paper-button class="primary-btn" @click="${() => this.save()}"> Create </paper-button>
        </div>
      </main>
    `;
  }

  @property() newForm: GenericObject = {};

  types: GenericObject[] = Array.from(EfaceFormTypes.values());

  @property() interventions: Intervention[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    getStoreAsync().then((store: Store<RootState>) => {
      store.dispatch(getEfaceInterventions());
    });
  }
  getLazyReducers() {
    return {
      efaceInterventions,
      eface
    };
  }

  stateChanged(state: RootState) {
    const mainPage = state.app!.routeDetails!.routeName;
    const subPage = state.app!.routeDetails!.subRouteName;
    if (mainPage !== 'eface' || subPage !== 'new') {
      this.newForm = {type: null};
      return;
    } else {
      this.interventions = state.efaceInterventions?.list || [];
    }
  }

  resetError(event: any): void {
    event.target.invalid = false;
  }

  setFormField(field: string, value: any): void {
    if (value === undefined || areEqual(this.newForm[field], value)) {
      return;
    }
    this.newForm[field] = value;
    this.requestUpdate();
  }

  save() {
    if (!this.validate()) {
      return;
    }
    fireEvent(this, 'global-loading', {
      active: true,
      loadingSource: this.localName
    });
    sendRequest({
      endpoint: {url: etoolsEndpoints.efaceForms.url!},
      body: {...this.newForm, activities: []},
      method: 'POST'
    })
      .then((form) => {
        store.dispatch(setEfaceForm(form));
        history.pushState(window.history.state, '', `${ROOT_PATH}eface/${form.id}/details`);
        window.dispatchEvent(new CustomEvent('popstate'));
      })
      .catch((error) => fireEvent(this, 'toast', {text: formatServerErrorAsText(error)}))
      .finally(() =>
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: this.localName
        })
      );
  }

  private validate(): boolean {
    let valid = true;
    this.shadowRoot!.querySelectorAll('*[required]').forEach((element: any) => {
      const fieldValid: boolean = element.validate();
      valid = valid && fieldValid;
    });
    return valid;
  }
}
