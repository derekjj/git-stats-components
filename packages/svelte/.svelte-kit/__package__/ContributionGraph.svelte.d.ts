import { SvelteComponent } from "svelte";
import { type ColorScheme } from '@git-stats-components/core';
declare const __propDef: {
    props: {
        dataUrl?: string;
        profileIndex?: number;
        colorScheme?: ColorScheme;
        showSettings?: boolean;
        cacheTTL?: number;
    };
    events: {
        dayClick: CustomEvent<any>;
        colorSchemeChange: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'settings-icon': {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ContributionGraphProps = typeof __propDef.props;
export type ContributionGraphEvents = typeof __propDef.events;
export type ContributionGraphSlots = typeof __propDef.slots;
export default class ContributionGraph extends SvelteComponent<ContributionGraphProps, ContributionGraphEvents, ContributionGraphSlots> {
}
export {};
