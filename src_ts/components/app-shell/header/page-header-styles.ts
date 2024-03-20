import {css} from 'lit';

// language=CSS
export const pageHeaderStyles = css`
  app-toolbar {
    padding: 0 16px 0 0;
    height: auto;
  }

  #menuButton {
    display: block;
    color: var(--header-color);
  }

  .content-align {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
    justify-content: space-between;
  }

  #app-logo {
    height: 32px;
    width: auto;
  }

  .envWarning {
    color: #000;
    background-color: var(--nonprod-text-warn-color);
    font-weight: 700;
    padding: 5px 10px;
    font-size: var(--etools-font-size-14, 14px);
    line-height: 1;
    border-radius: 10px;
  }

  etools-dropdown::part(display-input) {
    text-align: right;
  }

  @media (min-width: 850px) {
    #menuButton {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .envWarning {
      font-size: 10px;
      line-height: 12px;
      white-space: nowrap;
    }
    .envLong {
      display: none;
    }
  }

  @media (max-width: 576px) {
    #app-logo {
      display: none;
    }
    app-toolbar {
      padding-inline-end: 0px;
    }
  }
`;
