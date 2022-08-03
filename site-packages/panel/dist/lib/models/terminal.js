import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { div } from "@bokehjs/core/dom";
import { ModelEvent } from "@bokehjs/core/bokeh_events";
import { PanelHTMLBoxView, set_size } from "./layout";
export class KeystrokeEvent extends ModelEvent {
    constructor(key) {
        super();
        this.key = key;
        this.event_name = "keystroke";
    }
    _to_json() {
        return { model: this.origin, key: this.key };
    }
}
KeystrokeEvent.__name__ = "KeystrokeEvent";
export class TerminalView extends PanelHTMLBoxView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.output.change, this.write);
        this.connect(this.model.properties._clears.change, this.clear);
    }
    render() {
        super.render();
        this.container = div({ class: "terminal-container" });
        set_size(this.container, this.model);
        this.term = this.getNewTerminal();
        this.term.onData((value) => {
            this.handleOnData(value);
        });
        this.webLinksAddon = this.getNewWebLinksAddon();
        this.term.loadAddon(this.webLinksAddon);
        this.term.open(this.container);
        this.term.onRender(() => {
            if (!this._rendered)
                this.fit();
        });
        this.write();
        this.el.appendChild(this.container);
    }
    getNewTerminal() {
        const wn = window;
        if (wn.Terminal)
            return new wn.Terminal(this.model.options);
        else
            return new wn.xtermjs.Terminal(this.model.options);
    }
    getNewWebLinksAddon() {
        const wn = window;
        return new wn.WebLinksAddon.WebLinksAddon();
    }
    handleOnData(value) {
        this.model.trigger_event(new KeystrokeEvent(value));
    }
    write() {
        const text = this.model.output;
        if (text == null || !text.length)
            return;
        // https://stackoverflow.com/questions/65367607/how-to-handle-new-line-in-xterm-js-while-writing-data-into-the-terminal
        const cleaned = text.replace(/\r?\n/g, "\r\n");
        // var text = Array.from(cleaned, (x) => x.charCodeAt(0))
        this.term.write(cleaned);
    }
    clear() {
        this.term.clear();
    }
    fit() {
        const sizing = this.box_sizing();
        const vert_margin = sizing.margin == null ? 0 : sizing.margin.top + sizing.margin.bottom;
        const horz_margin = sizing.margin == null ? 0 : sizing.margin.left + sizing.margin.right;
        const width = (this.layout.inner_bbox.width || this.model.width || 0) - horz_margin;
        const height = (this.layout.inner_bbox.height || this.model.height || 0) - vert_margin;
        const renderer = this.term._core._renderService;
        const cell_width = renderer.dimensions.actualCellWidth || 9;
        const cell_height = renderer.dimensions.actualCellHeight || 18;
        if (width == null || height == null || width <= 0 || height <= 0)
            return;
        const cols = Math.max(2, Math.floor(width / cell_width));
        const rows = Math.max(1, Math.floor(height / cell_height));
        if (this.term.rows !== rows || this.term.cols !== cols)
            this.term.resize(cols, rows);
        this.model.ncols = cols;
        this.model.nrows = rows;
        this._rendered = true;
    }
    after_layout() {
        super.after_layout();
        this.fit();
    }
    resize_layout() {
        super.resize_layout();
        this.fit();
    }
}
TerminalView.__name__ = "TerminalView";
// The Bokeh .ts model corresponding to the Bokeh .py model
export class Terminal extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
    static init_Terminal() {
        this.prototype.default_view = TerminalView;
        this.define(({ Any, Int, String }) => ({
            _clears: [Int, 0],
            options: [Any, {}],
            output: [String,],
            ncols: [Int],
            nrows: [Int],
        }));
    }
}
Terminal.__name__ = "Terminal";
Terminal.__module__ = "panel.models.terminal";
Terminal.init_Terminal();
//# sourceMappingURL=terminal.js.map