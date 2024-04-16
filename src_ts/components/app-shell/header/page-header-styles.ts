import {css} from 'lit';

// language=CSS
export const pageHeaderStyles = css`
  app-toolbar {
    padding: 0 16px 0 0;
    height: auto;
  }

  .titlebar {
    color: var(--header-color);
  }

  #menuButton {
    display: block;
    color: var(--header-color);
  }

  .titlebar {
    flex: 1;
    font-size: var(--etools-font-size-28, 28px);
    font-weight: 300;
  }

  .titlebar img {
    width: 34px;
    margin: 0 8px 0 24px;
  }

  .content-align {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  #app-logo {
    height: 32px;
    width: auto;
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
    #envWarning {
      display: none;
    }
    .envLong {
      display: none;
    }
    .titlebar img {
      margin: 0 8px 0 12px;
    }
    etools-profile-dropdown {
      width: 40px;
    }
  }

  @media (max-width: 576px) {
    #app-logo {
      display: none;
    }
    .titlebar img {
      margin: 0 8px 0 4px;
    }
    .envWarning {
      font-size: var(--etools-font-size-10, 10px);
      line-height: 12px;
      white-space: nowrap;
      margin-left: 2px;
    }
    app-toolbar {
      padding-inline-end: 0px;
    }
  }
`;
