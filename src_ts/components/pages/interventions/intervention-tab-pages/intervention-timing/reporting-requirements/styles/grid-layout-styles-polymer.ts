import {html} from '@polymer/polymer/polymer-element.js';
import {gridLayoutStylesContent} from '../../../common/styles/grid-layout-styles-lit';

// language=HTML
export const gridLayoutStylesPolymer = () => {
  const template = document.createElement('template');
  template.innerHTML = `<style>
    ${gridLayoutStylesContent}
   </style>`;
  return template;
};
