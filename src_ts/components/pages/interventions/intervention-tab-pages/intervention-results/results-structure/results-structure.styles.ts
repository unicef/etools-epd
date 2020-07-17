import {css, CSSResult} from 'lit-element';

// language=CSS
export const ResultStructureStyles: CSSResult = css`
  .heading {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .data {
    font-size: 16px;
    line-height: 24px;
    color: var(--primary-text-color);
  }
  .bold-data {
    font-weight: bold;
    font-size: 18px;
  }
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text {
    font-size: 12px;
    line-height: 14px;
  }
  .details-heading {
    margin-bottom: 5px;
    color: var(--secondary-text-color);
  }
  .details-text {
    font-size: 13px;
    line-height: 15px;
  }
  .header {
    border: 1px solid var(--main-border-color);
    padding-left: 56px !important;
  }
  div[slot="row-data"] {
    width: 100%;
  }
  .details-container {
    width: 25%;
  }
  .details-list-item {
    margin-bottom: 3px;
  }
  .add-pd {
    width: 100%;
    height: 57px;
    background-color: var(--secondary-background-color);
    font-size: 12px;
    color: var(--secondary-text-color);
    box-sizing: border-box;
  }
  .number-data {
    width: 100px;
    margin-left: 10px;
  }
  iron-icon {
    margin: 0 15px;
    opacity: 0.9;
    cursor: pointer;
  }
  iron-icon:hover {
    opacity: 1;
  }
  *[hidden] {
    display: none !important;
  }
`;
