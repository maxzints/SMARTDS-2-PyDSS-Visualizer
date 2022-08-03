import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { div } from "@bokehjs/core/dom";
import { ColumnDataSource } from "@bokehjs/models/sources/column_data_source";
import { PanelHTMLBoxView, set_size } from "./layout";
const THEMES = {
    'material-dark': 'Material Dark',
    'material': 'Material Light',
    'material-dense': 'Material Light',
    'material-dense-dark': 'Material Dark',
    'vaporwave': 'Vaporwave',
    'solarized': 'Solarized',
    'solarized-dark': 'Solarized Dark',
    'monokai': 'Monokai'
};
const PLUGINS = {
    'datagrid': 'Datagrid',
    'd3_x_bar': 'X Bar',
    'd3_y_bar': 'Y Bar',
    'd3_xy_line': 'X/Y Line',
    'd3_y_line': 'Y Line',
    'd3_y_area': 'Y Area',
    'd3_y_scatter': 'Y Scatter',
    'd3_xy_scatter': 'X/Y Scatter',
    'd3_treemap': 'Treemap',
    'd3_candlestick': 'Candlestick',
    'd3_sunburst': 'Sunburst',
    'd3_heatmap': 'Heatmap',
    'd3_ohlc': 'OHLC'
};
function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach(key => {
        ret[obj[key]] = key;
    });
    return ret;
}
const PLUGINS_REVERSE = objectFlip(PLUGINS);
const THEMES_REVERSE = objectFlip(THEMES);
export class PerspectiveView extends PanelHTMLBoxView {
    constructor() {
        super(...arguments);
        this._updating = false;
        this._config_listener = null;
        this._current_config = null;
        this._event_listener = null;
        this._loaded = false;
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.source.properties.data.change, () => this.setData());
        this.connect(this.model.properties.toggle_config.change, () => {
            this.perspective_element.toggleConfig();
            this.fix_layout();
        });
        this.connect(this.model.properties.columns.change, () => {
            this.perspective_element.restore({ "columns": this.model.columns });
        });
        this.connect(this.model.properties.expressions.change, () => {
            this.perspective_element.restore({ "expressions": this.model.expressions });
        });
        this.connect(this.model.properties.split_by.change, () => {
            this.perspective_element.restore({ "split_by": this.model.split_by });
        });
        this.connect(this.model.properties.group_by.change, () => {
            this.perspective_element.restore({ "group_by": this.model.group_by });
        });
        this.connect(this.model.properties.aggregates.change, () => {
            this.perspective_element.restore({ "aggregates": this.model.aggregates });
        });
        this.connect(this.model.properties.filters.change, () => {
            this.perspective_element.restore({ "filter": this.model.filters });
        });
        this.connect(this.model.properties.sort.change, () => {
            this.perspective_element.restore({ "sort": this.model.sort });
        });
        this.connect(this.model.properties.plugin.change, () => {
            this.perspective_element.restore({ "plugin": PLUGINS[this.model.plugin] });
        });
        this.connect(this.model.properties.selectable.change, () => {
            this.perspective_element.restore({ "plugin_config": { ...this._current_config, selectable: this.model.selectable } });
        });
        this.connect(this.model.properties.editable.change, () => {
            this.perspective_element.restore({ "plugin_config": { ...this._current_config, editable: this.model.editable } });
        });
        this.connect(this.model.properties.theme.change, () => {
            this.perspective_element.restore({ "theme": THEMES[this.model.theme] }).catch(() => { });
        });
        if (this.model.document != null) {
            this._event_listener = (event) => this.on_event(event);
            this.model.document.on_change(this._event_listener);
        }
    }
    disconnect_signals() {
        if (this._config_listener != null)
            this.perspective_element.removeEventListener("perspective-config-update", this._config_listener);
        this._config_listener = null;
        if (this.model.document != null && this._event_listener != null)
            this.model.document.remove_on_change(this._event_listener);
        this._event_listener = null;
        super.disconnect_signals();
    }
    async render() {
        super.render();
        this.worker = window.perspective.worker();
        this.table = await this.worker.table(this.model.schema);
        this.table.update(this.data);
        const container = div({
            class: "pnx-perspective-viewer",
            style: {
                zIndex: 0,
            }
        });
        set_size(container, this.model);
        container.innerHTML = "<perspective-viewer style='height:100%; width:100%;'></perspective-viewer>";
        this.perspective_element = container.children[0];
        this.perspective_element.resetThemes([...Object.values(THEMES)]).catch(() => { });
        set_size(this.perspective_element, this.model);
        this.el.appendChild(container);
        this.perspective_element.load(this.table);
        const plugin_config = {
            ...this.model.plugin_config,
            editable: this.model.editable,
            selectable: this.model.selectable
        };
        this.perspective_element.restore({
            aggregates: this.model.aggregates,
            columns: this.model.columns,
            expressions: this.model.expressions,
            filter: this.model.filters,
            split_by: this.model.split_by,
            group_by: this.model.group_by,
            plugin: PLUGINS[this.model.plugin],
            plugin_config: plugin_config,
            sort: this.model.sort,
            theme: THEMES[this.model.theme]
        }).catch(() => { });
        this._config_listener = () => this.sync_config();
        this._current_config = await this.perspective_element.save();
        if (this.model.toggle_config)
            this.perspective_element.toggleConfig();
        this.perspective_element.addEventListener("perspective-config-update", this._config_listener);
        this._loaded = true;
        this.fix_layout();
    }
    fix_layout() {
        this.update_layout();
        this.compute_layout();
        this.invalidate_layout();
    }
    sync_config() {
        if (this._updating)
            return true;
        this.perspective_element.save().then((config) => {
            this._current_config = config;
            const props = {};
            for (let option in config) {
                let value = config[option];
                if (value === undefined || (option == 'plugin' && value === "debug") || option === 'settings')
                    continue;
                if (option === 'filter')
                    option = 'filters';
                else if (option === 'plugin')
                    value = PLUGINS_REVERSE[value];
                else if (option === 'theme')
                    value = THEMES_REVERSE[value];
                props[option] = value;
            }
            this._updating = true;
            this.model.setv(props);
            this._updating = false;
        });
        return true;
    }
    on_event(event) {
        event = event.hint;
        if (event == null || event.column_source == null || event.column_source.id != this.model.source.id)
            return;
        else if (event.rollover !== undefined)
            this.stream(event.data, event.rollover);
        else if (event.patches !== undefined)
            this.patch(event.patches);
    }
    get data() {
        const data = {};
        for (const column of this.model.source.columns())
            data[column] = this.model.source.get_array(column);
        return data;
    }
    stream(data, rollover) {
        if (!this._loaded)
            return;
        else if (rollover == null)
            this.table.update(data);
        else
            this.table.replace(this.data);
    }
    patch(_) {
        this.table.replace(this.data);
    }
    setData() {
        if (this._loaded)
            this.table.load(this.data);
    }
}
PerspectiveView.__name__ = "PerspectiveView";
export class Perspective extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
    static init_Perspective() {
        this.prototype.default_view = PerspectiveView;
        this.define(({ Any, Array, Boolean, Ref, Nullable, String }) => ({
            aggregates: [Any,],
            columns: [Array(Nullable(String)),],
            expressions: [Nullable(Array(String)),],
            split_by: [Nullable(Array(String)),],
            editable: [Nullable(Boolean),],
            filters: [Nullable(Array(Any)),],
            group_by: [Nullable(Array(String)),],
            plugin: [String,],
            plugin_config: [Any,],
            selectable: [Nullable(Boolean),],
            schema: [Any, {}],
            toggle_config: [Boolean, true],
            sort: [Nullable(Array(Array(String))),],
            source: [Ref(ColumnDataSource),],
            theme: [String,],
        }));
    }
}
Perspective.__name__ = "Perspective";
Perspective.__module__ = "panel.models.perspective";
Perspective.init_Perspective();
//# sourceMappingURL=perspective.js.map