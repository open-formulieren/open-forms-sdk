import { applyPrefix } from '../utils';

const TEMPLATE = `
<fieldset class="${applyPrefix('fieldset')}">
  {% if (ctx.component.legend) { %}
  <legend ref="header" class="${applyPrefix('legend')}">
    {{ctx.t(ctx.component.legend, { _userInput: true })}}
    {% if (ctx.component.tooltip) { %}
      <i ref="tooltip" class="{{ctx.iconClass('question-sign')}} text-muted" data-tooltip="{{ctx.component.tooltip}}"></i>
    {% } %}
  </legend>
  {% } %}
  {% if (!ctx.collapsed) { %}
  <div class="${applyPrefix('fieldset-body')}" ref="{{ctx.nestedKey}}">
    {{ctx.children}}
  </div>
  {% } %}
</fieldset>
`;

export default TEMPLATE;
