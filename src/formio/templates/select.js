const TEMPLATE = `
<select
  ref="{{ctx.input.ref ? ctx.input.ref : 'select'}}"
  {{ ctx.input.multiple ? 'multiple' : '' }}

  {% for (var attr in ctx.input.attr) { %}
    {{attr}}="{{ctx.input.attr[attr]}}"
  {% } %}

  {% if (!ctx.input.attr.id) { %}
    id="{{ctx.instance.id}}-{{ctx.component.key}}"
  {% } %}
>
    {% for (var attr of ctx.input.component.data.values) { %}
        <option value="{{attr.value}}">{{attr.label}}</option>
    {% } %}
</select>
`;

export default TEMPLATE;
