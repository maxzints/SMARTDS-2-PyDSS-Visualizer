import { ModelEvent } from "@bokehjs/core/bokeh_events";
import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { PanelHTMLBoxView } from "./layout";
export class JSONEditEvent extends ModelEvent {
    constructor(data) {
        super();
        this.data = data;
        this.event_name = "json_edit";
    }
    _to_json() {
        return { model: this.origin, data: this.data };
    }
}
JSONEditEvent.__name__ = "JSONEditEvent";
export class JSONEditorView extends PanelHTMLBoxView {
    connect_signals() {
        super.connect_signals();
        const { data, disabled, templates, menu, mode, search, schema } = this.model.properties;
        this.on_change([data], () => this.editor.update(this.model.data));
        this.on_change([templates], () => {
            this.editor.options.templates = this.model.templates;
        });
        this.on_change([menu], () => {
            this.editor.options.menu = this.model.menu;
        });
        this.on_change([search], () => {
            this.editor.options.search = this.model.search;
        });
        this.on_change([schema], () => {
            this.editor.options.schema = this.model.schema;
        });
        this.on_change([disabled, mode], () => {
            const mode = this.model.disabled ? 'view' : this.model.mode;
            this.editor.setMode(mode);
        });
    }
    remove() {
        super.remove();
        this.editor.destroy();
    }
    render() {
        super.render();
        const mode = this.model.disabled ? 'view' : this.model.mode;
        this.editor = new window.JSONEditor(this.el, {
            menu: this.model.menu,
            mode: mode,
            onChangeJSON: (json) => {
                this.model.data = json;
            },
            onSelectionChange: (start, end) => {
                this.model.selection = [start, end];
            },
            search: this.model.search,
            schema: this.model.schema,
            templates: this.model.templates,
        });
        this.editor.set(this.model.data);
    }
}
JSONEditorView.__name__ = "JSONEditorView";
export class JSONEditor extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
    static init_JSONEditor() {
        this.prototype.default_view = JSONEditorView;
        this.define(({ Any, Array, Boolean, String }) => ({
            data: [Any, {}],
            mode: [String, 'tree'],
            menu: [Boolean, true],
            search: [Boolean, true],
            selection: [Array(Any), []],
            schema: [Any, null],
            templates: [Array(Any), []],
        }));
    }
}
JSONEditor.__name__ = "JSONEditor";
JSONEditor.__module__ = "panel.models.json_editor";
JSONEditor.init_JSONEditor();
//# sourceMappingURL=json_editor.js.map