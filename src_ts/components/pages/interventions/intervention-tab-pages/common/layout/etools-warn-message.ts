import {LitElement, html, property, customElement} from 'lit-element';
import {AnyObject} from '../../../../../../types/globals';

export class WarnMessage {
  public msg = '';
  constructor(m: string) {
    this.msg = m;
  }
}

/**
 * @customElement
 */
@customElement('etools-warn-message')
export class EtoolsWarnMessage extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          width: 100%;
        }
        .warning {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 24px;
          background-color: var(--lightest-info-color);
        }
        .warning p {
          margin: 0;
        }
        .warning p + p {
          margin-top: 12px;
        }
      </style>

      <div class="warning">
        ${this._internalMsgs.map((item: AnyObject) => html`<p>${item.msg}</p>`)}
      </div>
    `;
  }

  private _messages: string | string[] = [];

  @property({type: Array})
  set messages(messages: string | string[]) {
    this._messages = messages;
    this._messagesChanged(messages);
  }

  get messages() {
    return this._messages;
  }

  @property({type: Array})
  _internalMsgs: WarnMessage[] = [];

  _messagesChanged(msgs: string | string[]) {
    if (!msgs || msgs.length === 0) {
      return;
    }
    this._internalMsgs =
      msgs instanceof Array && msgs.length > 0
        ? msgs.map((msg: string) => new WarnMessage(msg))
        : [new WarnMessage(msgs as string)];

    this._internalMsgs = [...this._internalMsgs];
  }
}
