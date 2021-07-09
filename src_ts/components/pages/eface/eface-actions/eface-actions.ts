import {GenericObject} from '@unicef-polymer/etools-types/dist/global.types';
import {customElement, html, LitElement, property} from 'lit-element';
import {ActionsStyles} from './actions-styles.js';
import {fireEvent} from '../../../utils/fire-custom-event';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {etoolsEndpoints} from '../../../../endpoints/endpoints-list';
import {get as getTranslation} from 'lit-translate';
import {PaperMenuButton} from '@polymer/paper-menu-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-icon-button/paper-icon-button';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import '../../common/layout/are-you-sure';
import {openDialog} from '../../common/utils/dialog.js';
import {
  ACTIONS_WITHOUT_CONFIRM,
  ACTIONS_WITH_INPUT,
  BACK_ACTIONS,
  CANCEL,
  EXPORT_ACTIONS,
  namesMap
} from './actions.js';
import {arrowLeftIcon} from '../../common/styles/app-icons.js';

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
    const exportActions: string[] = EXPORT_ACTIONS.filter((action: string) => actions.has(action));
    const backAction: string | undefined = BACK_ACTIONS.find((action: string) => actions.has(action));
    const [mainAction, ...groupedActions] = this.actions.filter(
      (action: string) => !exportActions.includes(action) && action !== backAction
    );
    return html`
      ${this.renderExport(exportActions)}${this.renderBackAction(backAction)}
      ${this.renderGroupedActions(mainAction, groupedActions)}
    `;
  }

  @property({type: Array})
  actions = [];

  @property({type: String})
  tripId!: string;

  private actionsNamesMap = new Proxy(namesMap, {
    get(target: GenericObject<string>, property: string): string {
      return target[property] || property.replace('_', ' ');
    }
  });

  private renderExport(actions: string[]) {
    const preparedExportActions = actions.map((action: string) => ({
      name: this.actionsNamesMap[action],
      type: action
    }));
    return actions.length
      ? html` <export-data .exportLinks="${preparedExportActions}" .tripId="${this.tripId}"></export-data> `
      : html``;
  }

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

  async confirmAction(action: string) {
    if (ACTIONS_WITHOUT_CONFIRM.includes(action)) {
      return true;
    }
    let message = '';
    let btn = '';
    switch (action) {
      case 'cancel':
        message = getTranslation('CANCEL_PROMPT');
        break;
      case 'reject_review':
        message = getTranslation('REJECT_REVIEW_PROMPT');
        break;
      case 'submit':
        message = getTranslation('SUBMIT_PROMPT');
        break;
      case 'approve':
        message = getTranslation('APPROVE_PROMPT');
        break;
      case 'review':
        message = getTranslation('REVIEW_PROMPT');
        break;
      default:
        btn = this.actionsNamesMap[action];
        message = getTranslation('ARE_YOU_SURE_PROMPT') + this.actionsNamesMap[action]?.toLowerCase() + ' ?';
    }
    return await openDialog({
      dialog: 'are-you-sure',
      dialogData: {
        content: message,
        confirmBtnText: btn || getTranslation('GENERAL.YES')
      }
    }).then(({confirmed}) => confirmed);
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

    const endpoint = getEndpoint(etoolsEndpoints.action, {
      // TODO
      tripId: this.tripId,
      action
    });
    fireEvent(this, 'global-loading', {
      active: true,
      loadingSource: 'eface-actions'
    });
    sendRequest({
      endpoint,
      body,
      method: 'PATCH'
    })
      .then((trip: any) => {
        // store.dispatch(setCurrentEface(trip));
      })
      .catch((err: any) => {
        fireEvent(this, 'toast', {text: formatServerErrorAsText(err)});
      })
      .finally(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: 'trip-actions'
        });
      });
  }

  private closeDropdown(): void {
    const element: PaperMenuButton | null = this.shadowRoot!.querySelector('paper-menu-button');
    if (element) {
      element.close();
    }
  }

  private openActionsWithInputsDialogs(action: string) {
    switch (action) {
      case 'cancel':
        return this.openCancelReason(action);
      case 'reject':
        return this.openCancelReason(action);
      default:
        return;
    }
  }

  private openCancelReason(action: string): Promise<any> {
    return openDialog({
      dialog: 'reason-popup',
      dialogData: {
        popupTitle: `${this.actionsNamesMap[action]} reason`,
        label: `${this.actionsNamesMap[action]} comment`
      }
    }).then(({confirmed, response}) => {
      if (!confirmed || !response) {
        return null;
      }
      if (action === 'cancel') {
        return {comment: response.comment};
      }
      if (action === 'reject') {
        return {comment: response.comment};
      }
      return null;
    });
  }
}
