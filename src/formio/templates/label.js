// const TEMPLATE = `
// <label class="openforms-label {{ctx.label.className}}" for="{{ctx.instance.id}}-{{ctx.component.key}}">
//   {{ ctx.t(ctx.component.label) }}
//   {% if (ctx.component.tooltip) { %}
//     <i ref="tooltip" class="{{ctx.iconClass('question-sign')}}"></i>
//   {% } %}
// </label>
// `;

const TEMPLATE = `
<label class="openforms-label {{ctx.label.className}}" style="display: table-cell" for="{{ctx.instance.id}}-{{ctx.component.key}}">
  {{ ctx.t(ctx.component.label) }}
  {% if (ctx.component.tooltip) { %}
    <i ref="tooltip" class="{{ctx.iconClass('question-sign')}}"></i>
  {% } %}
</label>
`;

export default TEMPLATE;
