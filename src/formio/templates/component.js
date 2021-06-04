import { applyPrefix } from '../utils';

// const TEMPLATE = `
// <div id="{{ctx.id}}" class="{{ctx.classes}}"{% if (ctx.styles) { %} styles="{{ctx.styles}}"{% } %} ref="component">
//   <div ref="messageContainer" class="${applyPrefix('errors')}"></div>
//   {% if (ctx.visible) { %}
//   {{ctx.children}}
//   {% } %}
// </div>
// `;


const TEMPLATE = `
<div id="{{ctx.id}}" class="{{ctx.classes}}" style="display: table;width: 100%; table-layout: fixed;" ref="component">
    <div style="display: table-row">
        {{ctx.children}}
    </div>
</div>
`;


export default TEMPLATE;
