import {customElement, html, LitElement, property} from 'lit-element';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {get as getTranslation} from 'lit-translate';
import '../../common/layout/are-you-sure';
import '../../common/layout/reason-popup';
import {efaceEndpoints} from '../../common/utils/eface-endpoints.js';
import {ActionsStyles} from '../../common/layout/available-actions/actions-styles';
import {arrowLeftIcon} from '../../common/styles/app-icons';
import {
  ACTIONS_WITH_INPUT,
  ActionToStatus,
  BACK_ACTIONS,
  CANCEL,
  namesMap,
  REJECT,
  SEND_TO_VISION,
  SUBMIT,
  TRANSACTION_APPROVE,
  TRANSACTION_REJECT
} from './actions-and-statuses';
import {GenericObject} from '@unicef-polymer/etools-types/dist/global.types';
import {fireEvent} from '../../../utils/fire-custom-event';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {openDialog} from '../../common/utils/dialog';
import {PaperMenuButton} from '@polymer/paper-menu-button/paper-menu-button';
import {getStore} from '../../common/utils/redux-store-access';
import {Eface} from '../eface-tab-pages/types';
import {setEfaceForm} from '../../../../redux/actions/eface-forms';
import {capitalizeFirstLetter} from '../../common/utils/utils';

@customElement('eface-actions')
export class EfaceActions extends LitElement {
  static get styles() {
    return [ActionsStyles];
  }
  protected render() {
    if (!this.actions) {
      return '';
    }
    const actions: Set<string> = new Set(this.actions);
    const backAction: string | undefined = BACK_ACTIONS.find((action: string) => actions.has(action));
    const [mainAction, ...groupedActions] = this.actions.filter((action: string) => action !== backAction);
    return html` ${this.renderBackAction(backAction)} ${this.renderGroupedActions(mainAction, groupedActions)} `;
  }

  @property({type: Array})
  actions = [];

  @property({type: String})
  entityId!: string;

  namesMap: GenericObject<string> = namesMap;
  actionsNamesMap = new Proxy(this.namesMap, {
    get(target: GenericObject<string>, property: string): string {
      return target[property] || property.replaceAll('_', ' ');
    }
  });

  private renderBackAction(action?: string) {
    return action
      ? html`
          <paper-button class="main-button back-button" @click="${() => this.processAction(action)}">
            ${arrowLeftIcon} <span>${this.actionsNamesMap[action]}</span>
          </paper-button>
        `
      : html``;
  }

  private renderGroupedActions(mainAction: string, actions: string[]) {
    const withAdditional = actions.length ? ' with-additional' : '';
    const onlyCancel = !actions.length && mainAction === CANCEL ? ` cancel-background` : '';
    const className = `main-button${withAdditional}${onlyCancel}`;
    return mainAction
      ? html`
          <paper-button class="${className}" @click="${() => this.processAction(mainAction)}">
            ${this.actionsNamesMap[mainAction]} ${this.getAdditionalTransitions(actions)}
          </paper-button>
        `
      : html``;
  }

  private getAdditionalTransitions(actions?: string[]) {
    if (!actions || !actions.length) {
      return html``;
    }
    return html`
      <paper-menu-button horizontal-align="right" @click="${(event: MouseEvent) => event.stopImmediatePropagation()}">
        <paper-icon-button slot="dropdown-trigger" class="option-button" icon="expand-more"></paper-icon-button>
        <div slot="dropdown-content">
          ${actions.map(
            (action: string) => html`
              <div class="other-options" @click="${() => this.processAction(action)}">
                ${this.actionsNamesMap[action]}
              </div>
            `
          )}
        </div>
      </paper-menu-button>
    `;
  }

  async processAction(action: string): Promise<void> {
    this.closeDropdown();

    if (!(await this.confirmAction(action))) {
      return;
    }
    const body = ACTIONS_WITH_INPUT.includes(action) ? await this.openActionsWithInputsDialogs(action) : {};
    if (body === null) {
      return;
    }
    body.status = ActionToStatus.get(action);

    const endpoint = getEndpoint(efaceEndpoints.efaceForm, {id: this.entityId});
    fireEvent(this, 'global-loading', {
      active: true,
      loadingSource: 'entity-actions'
    });
    sendRequest({
      endpoint,
      body,
      method: 'PATCH'
    })
      .then((form: Eface) => {
        getStore().dispatch(setEfaceForm(form));
      })
      .catch((err: any) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(err)});
      })
      .finally(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: 'entity-actions'
        });
      });
  }

  async confirmAction(action: string) {
    const {message, btn} = this.getConfirmDialogDetails(action)!;
    return await openDialog({
      dialog: 'are-you-sure',
      dialogData: {
        content: message,
        confirmBtnText: btn || getTranslation('GENERAL.YES')
      }
    }).then(({confirmed}) => confirmed);
  }

  getConfirmDialogDetails(action: string) {
    let message = '';
    let btn = '';
    switch (action) {
      case CANCEL:
        message = getTranslation('EFACE_ACTIONS_CONFIRMATIONS.CANCEL_PROMPT');
        break;
      case SUBMIT:
        message = getTranslation('EFACE_ACTIONS_CONFIRMATIONS.SUBMIT_PROMPT');
        break;
      case TRANSACTION_APPROVE:
        message = getTranslation('EFACE_ACTIONS_CONFIRMATIONS.APPROVE_PROMPT');
        break;
      case TRANSACTION_REJECT:
        message = getTranslation('EFACE_ACTIONS_CONFIRMATIONS.REJECT_PROMPT');
        break;
      case SEND_TO_VISION:
        message = getTranslation('EFACE_ACTIONS_CONFIRMATIONS.SEND_TO_VISION');
        break;
      default:
        btn = this.actionsNamesMap[action];
        message = getTranslation('ARE_YOU_SURE_PROMPT') + this.actionsNamesMap[action]?.toLowerCase() + ' ?';
    }
    return {message, btn};
  }

  private openActionsWithInputsDialogs(action: string) {
    switch (action) {
      case CANCEL:
      case TRANSACTION_REJECT:
      case REJECT:
        return this.openReasonPopup(action);
      default:
        return;
    }
  }

  private openReasonPopup(action: string): Promise<any> {
    return openDialog({
      dialog: 'reason-popup',
      dialogData: {
        popupTitle: `${capitalizeFirstLetter(this.actionsNamesMap[action])} Reason`,
        label: `${capitalizeFirstLetter(this.actionsNamesMap[action])} Comment`
      }
    }).then(({confirmed, response}) => {
      if (!confirmed || !response) {
        return null;
      }
      if (action === CANCEL) {
        return {cancel_reason: response.comment};
      }
      if (action === REJECT) {
        return {rejection_reason: response.comment};
      }
      if (action === TRANSACTION_REJECT) {
        return {rejection_reason: response.comment};
      }
      return null;
    });
  }

  private closeDropdown(): void {
    const element: PaperMenuButton | null = this.shadowRoot!.querySelector('paper-menu-button');
    if (element) {
      element.close();
    }
  }
}
