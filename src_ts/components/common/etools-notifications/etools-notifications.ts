import {LitElement, html, customElement, property} from 'lit-element';
import {AnyObject} from '@unicef-polymer/etools-types';

/**
 * @LitElement
 * @customElement
 */
@customElement('etools-notifications')
export class EtoolsNotifications extends LitElement {
  public render() {
    // main template
    // language=HTML
    return html`
      <style>
        ul {
          position: absolute;
          right: 0px;
          top: 0px;
          margin-block-start: 0px;
          padding-inline-start: 0px;
          padding-block-start: 0px;
          padding: 10px;
          overflow: hidden;
        }
        li {
          list-style: none;
          background-color: #5a5a5a;
          color: #fff;
          line-height: 16px;
          margin: 0.5em 0;
          padding: 0.8em;
          width: 380px;
          height: auto;
          position: relative;
          border-radius: 0.25em;
          opacity: 0;
          -webkit-transition: -webkit-transform 1.5s, opacity 0.7s;
          transition: transform 1.5s, opacity 0.7s;
          -webkit-transform: translateY(-1000px);
          transform: translateY(-1000px);
        }
        li.show {
          opacity: 1;
          -webkit-transform: translateY(0px);
          transform: translateY(0px);
        }
        iron-icon {
          width: 18px;
          cursor: pointer;
          position: absolute;
          top: -4px;
          right: -2px;
        }
      </style>

      ${this.notifications.length
        ? html`<ul>
            ${this.notifications.map((item) => this.getNotificationHtml(item, this.showNotification))}
          </ul>`
        : html``}
    `;
  }

  @property({type: Array})
  notifications: AnyObject[] = [];

  @property({type: Boolean})
  showNotification = false;

  connectedCallback() {
    super.connectedCallback();

    this._updateNotifications = this._updateNotifications.bind(this);
    document.body.addEventListener('show-notification', this._updateNotifications as any);

    setTimeout(() => {
      this.getDummyData();
    }, 5000);
  }

  _updateNotifications(e: CustomEvent) {
    this.renderNotifications(this.notifications.concat(e.detail.notifications || []));
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter((item) => item.id !== id);
  }

  getNotificationHtml(item: AnyObject, showItem: boolean) {
    return html`
      <li class=${showItem ? 'show' : ''}>
        ${item.message}
        <iron-icon icon="close" @click="${() => this.removeNotification(item.id)}"></iron-icon>
      </li>
    `;
  }

  renderNotifications(items: AnyObject[]) {
    this.showNotification = false;
    // depemds how we want to display new added notifications

    // this.notifications = [];
    // setTimeout(() => {
    this.notifications = items;
    setTimeout(() => {
      this.showNotification = true;
    }, 100);
    // }, 100);
  }

  getDummyData() {
    this.showNotification = false;
    const messages = [
      // eslint-disable-next-line max-len
      'Maecenas magna lectus, vestibulum ut nisl iaculis, mollis semper diam. Curabitur erat enim, finibus vel volutpat quis, consectetur at ante.',
      'Maecenas rutrum libero at erat sagittis aliquet. Duis tempus lacinia dui vitae consequat.'
    ];
    const dummyData = [];
    for (let i = 0; i < 6; i++) {
      dummyData.push({id: i, message: messages[i % 2]});
    }
    this.renderNotifications(dummyData);
  }
}
