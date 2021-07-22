import {customElement} from 'lit-element';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {get as getTranslation} from 'lit-translate';
import '../../common/layout/are-you-sure';
import {ACTIONS_WITHOUT_CONFIRM, ACTIONS_WITH_INPUT, BACK_ACTIONS, EXPORT_ACTIONS, namesMap} from './actions.js';
import {efaceEndpoints} from '../../common/utils/eface-endpoints.js';
import {AvailableActions} from '../../common/layout/available-actions/available-actions.js';

@customElement('eface-actions')
export class EfaceActions extends AvailableActions {
  constructor() {
    super();
    this.EXPORT_ACTIONS = EXPORT_ACTIONS;
    this.BACK_ACTIONS = BACK_ACTIONS;
    this.ACTIONS_WITHOUT_CONFIRM = ACTIONS_WITHOUT_CONFIRM;
    this.ACTIONS_WITH_INPUT = ACTIONS_WITH_INPUT;
    this.namesMap = namesMap;
  }

  afterActionPatch(_eface: any) {
    // TODO
  }

  getConfirmDialogDetails(action: string) {
    let message = '';
    let btn = '';
    switch (action) {
      case 'cancel':
        message = getTranslation('CANCEL_PROMPT');
        break;
      case 'submit':
        message = getTranslation('SUBMIT_PROMPT');
        break;
      case 'approve':
        message = getTranslation('APPROVE_PROMPT');
        break;
      case 'reject':
        message = getTranslation('REJECT_PROMPT');
        break;
      default:
        btn = this.actionsNamesMap[action];
        message = getTranslation('ARE_YOU_SURE_PROMPT') + this.actionsNamesMap[action]?.toLowerCase() + ' ?';
    }
    return {message, btn};
  }

  getActionEndpoint(action: string) {
    return getEndpoint(efaceEndpoints.efaceAction, {efaceId: this.entityId, action});
  }
}
