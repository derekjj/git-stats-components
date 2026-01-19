import { SvelteComponent } from "svelte";
import { type ExperienceEntry, type CustomStatCalculator } from '@git-stats-components/core';
declare const __propDef: {
    props: {
        dataUrl?: string;
        profileIndexes?: number[];
        experienceData?: ExperienceEntry[];
        showCustomStat?: boolean;
        customStatCalculator?: CustomStatCalculator | null;
        cacheTTL?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'icon-experience': {};
        'icon-projects': {};
        'icon-commits': {};
        'icon-custom': {};
        'custom-stat-label': {};
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type StatsBreakdownProps = typeof __propDef.props;
export type StatsBreakdownEvents = typeof __propDef.events;
export type StatsBreakdownSlots = typeof __propDef.slots;
export default class StatsBreakdown extends SvelteComponent<StatsBreakdownProps, StatsBreakdownEvents, StatsBreakdownSlots> {
}
export {};
