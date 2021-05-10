const TEMPLATE = `
<select
  ref="{{ctx.input.ref ? ctx.input.ref : 'selectContainer'}}"
  {{ ctx.input.multiple ? 'multiple' : '' }}

  {% for (var attr in ctx.input.attr) { %}
    {{attr}}="{{ctx.input.attr[attr]}}"
  {% } %}

  {% if (!ctx.input.attr.id) { %}
    id="{{ctx.instance.id}}-{{ctx.component.key}}"
  {% } %}
>
    {{ctx.selectOptions}}
</select>
`;

export default TEMPLATE;
