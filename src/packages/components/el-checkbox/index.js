/*
 * @Author: liwei
 * @Date: 2020-11-11 19:54:06
 * @Description: 复选组件
 */
import { createElementBySlot } from "../utils";

export default function(createElement, value, data) {
  const vm = this;

  // eslint-disable-next-line no-unused-vars
  const { formValues } = this;

  const {
    all = "",
    on = {},
    attrs = {},
    props = {},
    style = {},
    items = [],
    name = "",
    keys = null,
    render = { before: null, after: null }
  } = data;

  data.checkAll = data.checkAll || [];
  data.checkAllDisabled = data.checkAllDisabled || false;
  if (!this.inline) style.width = "";

  if (value.length > 0) {
    if (
      value.includes(all) ||
      (all && all !== undefined && value.length === items.length - 1)
    ) {
      const ids = items.map(m => (keys ? m[keys["value"]] : m["value"]));
      data.checkAll = ids;
      value = JSON.parse(JSON.stringify(ids));
    }
  }

  let nodes = [
    createElementBySlot(createElement, data, "before"),
    createElement(
      "el-checkbox-group",
      {
        style: { display: 'inline-flex', ...style },
        props: {
          value,
          ...attrs,
          ...props
        },
        on: {
          ...on,
          input(val) {
            // 包含全部选中的逻辑
            if ((all + "").length > 0) {
              const option = [];
              items.filter(m => {
                const allValue = keys ? m[keys["value"]] : m["value"];
                if (allValue === all) {
                  option.push(m);
                }
              });
              if (option.length > 0) {
                if (
                  (val.includes(all) && !data.checkAll.includes(all)) ||
                  (!val.includes(all) &&
                    !data.checkAll.includes(all) &&
                    items.length - 1 === val.length)
                ) {
                  val = [];
                  items.forEach((item, index) => {
                    if (data.checkAllDisabled) {
                      item.disabled = index !== 0;
                    }
                    val.push(keys ? item[keys["value"]] : item["value"]);
                  });
                } else if (!val.includes(all) && data.checkAll.includes(all)) {
                  val = [];
                  items.forEach(item => {
                    item.disabled = false;
                  });
                } else if (val.includes(all)) {
                  val.splice(val.indexOf(all), 1);
                }
                data.checkAll = val;
              }
            }
            eval(`formValues.${name} = val`);
          }
        }
      },
      (items || []).map(option => {
        return createElement(
          "el-checkbox",
          {
            props: {
              key: option.value,
              disabled: option.disabled,
              label: keys ? option[keys["value"]] : option["value"]
            }
          },
          [keys ? option[keys["label"]] : option["label"]]
        );
      }),
      typeof render.after === "function"
        ? render.after.call(vm, createElement)
        : []
    ),
    createElementBySlot(createElement, data, "after")
  ];

  return nodes;
}
