import * as p from "@bokehjs/core/properties";
import { Tabs as BkTabs, TabsView as BkTabsView } from "@bokehjs/models/layouts/tabs";
export declare class TabsView extends BkTabsView {
    model: Tabs;
    connect_signals(): void;
    get is_visible(): boolean;
    _update_layout(): void;
    update_zindex(): void;
    update_position(): void;
    render(): void;
    on_active_change(): void;
}
export declare namespace Tabs {
    type Attrs = p.AttrsOf<Props>;
    type Props = BkTabs.Props & {};
}
export interface Tabs extends BkTabs.Attrs {
}
export declare class Tabs extends BkTabs {
    properties: Tabs.Props;
    constructor(attrs?: Partial<Tabs.Attrs>);
    static __module__: string;
    static init_Tabs(): void;
}
