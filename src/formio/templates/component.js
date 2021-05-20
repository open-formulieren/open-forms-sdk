import { applyPrefix } from '../utils';

const TEMPLATE = `
<div id="{{ctx.id}}" class="{{ctx.classes}}"{% if (ctx.styles) { %} styles="{{ctx.styles}}"{% } %} ref="component">
  <div ref="messageContainer" class="${applyPrefix('errors')}"></div>
  {% if (ctx.visible) { %}
  {{ctx.children}}
  {% } %}
</div>
`;

export default TEMPLATE;
