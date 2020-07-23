import {LitElement, customElement, html} from 'lit-element';
import './reporting-requirements/partner-reporting-requirements';
import {connect} from 'pwa-helpers/connect-mixin';
import './intervention-dates/intervention-dates';
import {getStore} from '../utils/redux-store-access';

/**
 * @customElement
 */
@customElement('intervention-timing')
export class InterventionTiming extends connect(getStore())(LitElement) {
  render() {
    // language=HTML
    return html`
      <style></style>

      Timing page
      <partner-reporting-requirements class="content-section"> </partner-reporting-requirements>
      <intervention-dates></intervention-dates>
    `;
  }
}
