import {LitElement, html, customElement} from 'lit-element';
import '@polymer/iron-icons/communication-icons';

/* eslint-disable max-len */

/**
 * @LitElement
 * @customElement
 */
@customElement('support-btn')
export class SupportBtn extends LitElement {
  public render() {
    return html`
      <style>
        :host(:hover) {
          cursor: pointer;
        }
        a {
          color: inherit;
          text-decoration: none;
          font-size: 16px;
        }
        iron-icon {
          margin-right: 4px;
        }
        @media (max-width: 768px) {
          #supportTxt {
            display: none;
          }
        }
      </style>

      <a
        href="https://unicef.service-now.com/cc/?id=sc_cat_item&sys_id=35b00b1bdb255f00085184735b9619e6&sysparm_category=c6ab1444db5b5700085184735b961920"
        target="_blank"
      >
        <iron-icon icon="communication:textsms"></iron-icon><span id="supportTxt">Support</span>
      </a>
    `;
  }
}
