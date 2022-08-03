import { div } from "@bokehjs/core/dom";
import { HTMLBox } from "@bokehjs/models/layouts/html_box";
import { PanelHTMLBoxView } from "./layout";
export class QuillInputView extends PanelHTMLBoxView {
    initialize() {
        super.initialize();
        this._container = div({});
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.disabled.change, () => this.quill.enable(!this.model.disabled));
        this.connect(this.model.properties.text.change, () => {
            if (this._editing)
                return;
            this._editing = true;
            this.quill.enable(false);
            this.quill.setContents([]);
            this.quill.clipboard.dangerouslyPasteHTML(this.model.text);
            this.quill.enable(!this.model.disabled);
            this._editing = false;
        });
        const { mode, toolbar } = this.model.properties;
        this.on_change([mode, toolbar], () => {
            this.render();
            this._layout_toolbar();
        });
    }
    _layout_toolbar() {
        if (this._toolbar == null) {
            this.el.style.removeProperty('padding-top');
        }
        else {
            const height = this._toolbar.getBoundingClientRect().height + 1;
            this.el.style.paddingTop = height + "px";
            this._toolbar.style.marginTop = -height + "px";
        }
    }
    render() {
        super.render();
        this.el.appendChild(this._container);
        const theme = (this.model.mode === 'bubble') ? 'bubble' : 'snow';
        this.quill = new window.Quill(this._container, {
            modules: {
                toolbar: this.model.toolbar
            },
            readOnly: true,
            placeholder: this.model.placeholder,
            theme: theme
        });
        this._editor = this.el.querySelector('.ql-editor');
        this._toolbar = this.el.querySelector('.ql-toolbar');
        this.quill.clipboard.dangerouslyPasteHTML(this.model.text);
        this.quill.on('text-change', () => {
            if (this._editing)
                return;
            this._editing = true;
            this.model.text = this._editor.innerHTML;
            this._editing = false;
        });
        if (!this.model.disabled)
            this.quill.enable(!this.model.disabled);
    }
    after_layout() {
        super.after_layout();
        this._layout_toolbar();
    }
}
QuillInputView.__name__ = "QuillInputView";
export class QuillInput extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
    static init_QuillInput() {
        this.prototype.default_view = QuillInputView;
        this.define(({ Any, String }) => ({
            mode: [String, 'toolbar'],
            placeholder: [String, ''],
            text: [String, ''],
            toolbar: [Any, null],
        }));
        this.override({
            height: 300
        });
    }
}
QuillInput.__name__ = "QuillInput";
QuillInput.__module__ = "panel.models.quill";
QuillInput.init_QuillInput();
//# sourceMappingURL=quill.js.map