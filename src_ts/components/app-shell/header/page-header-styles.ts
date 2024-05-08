import {css} from 'lit';

// language=CSS
export const pageHeaderStyles = css`
  app-toolbar {
    padding-inline-end: 10px;
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
      font-size: var(--etools-font-size-10, 10px);
      line-height: 12px;
      white-space: nowrap;
    }
    .envLong {
      display: none;
    }
    etools-profile-dropdown {
      width: 50px;
    }
  }

  @media (max-width: 576px) {
    #app-logo {
      display: none;
    }
    .envWarning {
      margin-inline-start: 2px;
    }
  }
`;
