/**
 * ══════════════════════════════════════════════
 *  ABOUT SHEET COMPONENT (AboutSheet.tsx)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: A data-driven, Widget-based character sheet for the About section.
 * Renders individual UI modules based on a configuration schema.
 *
 * CRITICAL RULES:
 * - Layouts (3-col, tree-grid, etc.) must be defined in aboutConfig in aboutData.ts.
 * - New UI blocks should be created as internal Widget components first.
 */

import { createSignal, For, Switch, Match } from "solid-js";
import { characterData, aboutConfig, type TabWidget } from "./aboutData";

// 🧩 INTERNAL WIDGETS
const AbilitiesWidget = () => (
  <div class="abilities-col flx-clmn gap-4">
    <h4 class="txt-micro-label opacity-40 mb-2">Abilities</h4>
    <For each={characterData.abilities}>{(ability) => (
      <div class="ability-node flx-cntr-clmn border border-rgba(var(--gray), 0.1) p-3 rounded-xl hover:border-(--brand-secondary) transition-colors group">
        <span class="text-[0.65rem] font-black txt-color-accent group-hover:scale-110 transition-transform">{ability.name}</span>
        <span class="text-2xl font-black leading-none my-1">{ability.mod}</span>
        <div class="text-[0.6rem] opacity-60 uppercase font-bold">{ability.label}</div>
        <div class="mt-2 text-[0.6rem] border border-rgba(var(--gray), 0.1) rounded-full px-2">{ability.value}</div>
      </div>
    )}</For>
  </div>
);

const SkillsWidget = (props: { title?: string }) => (
  <div class="skills-col">
    <h4 class="txt-micro-label txt-color-accent border-b border-(--brand-secondary) mb-6 pb-2 uppercase tracking-tighter">{props.title || 'Skills'}</h4>
    <ul class="space-y-4">
      <For each={characterData.skills}>{(skill) => (
        <li class="flx-algncntr-rw gap-4 pb-3 border-b border-dotted border-rgba(var(--gray), 0.15)">
          <div class="dots flx-rw gap-1.5">
            {[0, 1, 2].map((i) => (
              <div class={`w-2.5 h-2.5 rounded-full border-2 border-(--brand-secondary) ${i < skill.level ? 'bg-(--brand-secondary)' : ''}`} />
            ))}
          </div>
          <span class="text-base font-bold tracking-tight">{skill.label}</span>
        </li>
      )}</For>
    </ul>
  </div>
);

const InventoryWidget = (props: { title?: string }) => (
  <div class="loot-box bg-rgba(var(--gray), 0.03) p-6 rounded-2xl border border-rgba(var(--gray), 0.05)">
    <h4 class="txt-micro-label txt-color-accent border-b border-(--brand-secondary) mb-4 pb-1 uppercase">{props.title || 'Loot'}</h4>
    <ul class="text-sm space-y-3 font-medium">
      <For each={characterData.inventory}>{(item) => <li>{item}</li>}</For>
    </ul>
  </div>
);

const TalentsWidget = () => (
  <div class="tab-content grid grid-cols-3 gap-12 h-full">
    <For each={Object.entries(characterData.talents)}>{([category, items]) => (
      <div class="talent-branch flx-clmn">
        <h4 class="txt-micro-label txt-color-accent border-b-2 border-(--brand-secondary) mb-8 uppercase tracking-widest">{category} Tree</h4>
        <div class="talent-nodes flx-clmn gap-8 relative pb-8">
          <For each={items}>{(item, i) => (
            <div class="talent-node flx-rw gap-5 items-center group">
              <div class="w-12 h-12 rounded-lg border-2 border-rgba(var(--gray), 0.2) flx-cntr shrink-0 bg-rgba(var(--gray), 0.03) group-hover:border-(--brand-secondary) group-hover:bg-rgba(var(--brand-secondary), 0.05) transition-all">
                <span class="text-sm font-black opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-transform">{i() + 1}</span>
              </div>
              <div class="talent-info">
                <h5 class="text-base font-black leading-none mb-2 group-hover:txt-color-accent transition-colors">{item.label}</h5>
                <span class={`text-[0.65rem] font-black uppercase px-2 py-1 rounded-md ${
                  item.val === 'Expert' ? 'bg-(--brand-secondary) text-(--bg-panel)' : 'border border-rgba(var(--gray), 0.2) opacity-60'
                }`}>{item.val}</span>
              </div>
            </div>
          )}</For>
          <div class="absolute left-6 top-0 bottom-0 w-px bg-rgba(var(--gray), 0.1) -z-1" />
        </div>
      </div>
    )}</For>
  </div>
);

const PhilosophyWidget = () => (
  <section class="mb-12">
    <h4 class="txt-micro-label txt-color-accent mb-6 border-b border-rgba(var(--gray), 0.1) uppercase font-black">Design Philosophy</h4>
    <div class="relative pl-8">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-(--brand-secondary) opacity-30"></div>
      <p class="text-2xl italic font-black leading-tight tracking-tight opacity-90">
        "{characterData.lore.philosophy}"
      </p>
    </div>
  </section>
);

const MilestonesWidget = () => (
  <section class="mb-10">
    <h4 class="txt-micro-label txt-color-accent mb-6 border-b border-rgba(var(--gray), 0.1) uppercase font-black">Campaign Milestones</h4>
    <ul class="space-y-6">
      <For each={characterData.lore.milestones}>{(m) => (
        <li class="flx-rw gap-6 group">
          <div class="w-2 h-2 rounded-full bg-(--brand-secondary) mt-2 group-hover:scale-150 transition-transform shrink-0"></div>
          <p class="text-base font-bold leading-normal opacity-80 group-hover:opacity-100 transition-opacity">{m}</p>
        </li>
      )}</For>
    </ul>
  </section>
);

const TraitsWidget = () => (
  <div class="traits-summary">
    <h4 class="txt-micro-label txt-color-accent opacity-40 uppercase font-black mb-6">Passive Features & Traits</h4>
    <For each={characterData.traits}>{(trait) => (
      <div class="trait-item mb-6 p-5 border border-rgba(var(--gray), 0.1) rounded-2xl hover:border-(--brand-secondary) transition-colors bg-rgba(var(--gray), 0.02)">
        <h5 class="text-sm font-black uppercase mb-2 tracking-wide txt-color-accent">{trait.title}</h5>
        <p class="text-xs leading-relaxed opacity-70 font-medium">{trait.description}</p>
      </div>
    )}</For>
  </div>
);

const PartyRoleWidget = () => (
  <div class="party-role border border-(--brand-secondary) p-4 rounded-lg bg-rgba(var(--brand-secondary), 0.02) mb-8">
    <h4 class="txt-micro-label mb-2">Primary Party Role</h4>
    <p class="text-xs font-bold leading-normal uppercase italic opacity-80">{characterData.lore.partyRole}</p>
  </div>
);

// 🛠️ COMPONENT REGISTRY
const WidgetMapper = (props: { widget: TabWidget }) => {
  return (
    <Switch>
      <Match when={props.widget.type === 'Abilities'}><AbilitiesWidget /></Match>
      <Match when={props.widget.type === 'Skills'}><SkillsWidget title={props.widget.title} /></Match>
      <Match when={props.widget.type === 'Inventory'}><InventoryWidget title={props.widget.title} /></Match>
      <Match when={props.widget.type === 'Talents'}><TalentsWidget /></Match>
      <Match when={props.widget.type === 'Philosophy'}><PhilosophyWidget /></Match>
      <Match when={props.widget.type === 'Milestones'}><MilestonesWidget /></Match>
      <Match when={props.widget.type === 'Traits'}><TraitsWidget /></Match>
      <Match when={props.widget.type === 'PartyRole'}><PartyRoleWidget /></Match>
    </Switch>
  );
};

export default function AboutSheet() {
  const [activeTabId, setActiveTabId] = createSignal(aboutConfig[0].id);
  const activeTab = () => aboutConfig.find(t => t.id === activeTabId())!;

  return (
    <div class="trpg-sheet surface-panel landscape-mode flx-clmn">
      
      {/* 🛡️ PERSISTENT GLOBAL HEADER */}
      <header class="sheet-global-header flx-rw justify-between items-center pb-6 mb-2 border-b-2 border-rgba(var(--gray), 0.1)">
        <div class="header-left flx-rw gap-6 items-center">
          <div class="profile-meta">
            <h2 class="txt-brand text-4xl mb-1">{characterData.name}</h2>
            <div class="meta-row flx-rw gap-4 text-[0.7rem] opacity-70 tracking-widest uppercase font-black">
               <span>CLASS: <strong class="text-color-accent">{characterData.class}</strong></span>
               <span>ALIGNMENT: <strong>{characterData.alignment}</strong></span>
            </div>
          </div>
          
          <div class="global-hp-box w-48 ml-8">
            <div class="flx-rw justify-between text-[0.6rem] font-black uppercase mb-1">
              <span>Hit Points</span>
              <span class="text-color-accent">{characterData.stats.hp.current} / {characterData.stats.hp.max}</span>
            </div>
            <div class="h-2 bg-rgba(var(--gray), 0.1) rounded-full overflow-hidden border border-rgba(var(--gray), 0.1)">
               <div class="h-full bg-(--brand-primary)" style={{ width: `${(characterData.stats.hp.current / characterData.stats.hp.max) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div class="header-right flx-rw gap-3">
          <For each={['Armor Class', 'Init', 'Speed']}>{(label) => {
            const val = label === 'Armor Class' ? characterData.stats.ac : label === 'Init' ? characterData.stats.init : characterData.stats.speed;
            return (
              <div class="status-node border-2 border-(--brand-secondary) p-2 px-5 rounded-xl flx-cntr-clmn bg-rgba(var(--brand-secondary), 0.03)">
                <span class="text-[0.6rem] font-black opacity-60 uppercase">{label}</span>
                <span class="text-2xl font-black">{val}</span>
              </div>
            );
          }}</For>
        </div>
      </header>

      {/* 🧭 NAVIGATION TABS */}
      <nav class="sheet-tabs flx-rw gap-8 mb-6">
        <For each={aboutConfig}>{(tab) => (
          <button
            onClick={() => setActiveTabId(tab.id)}
            class={`px-6 py-2 txt-micro-label border-b-2 transition-all duration-300 ${
              activeTabId() === tab.id
                ? "border-(--brand-secondary) text-color-accent opacity-100"
                : "border-transparent opacity-40 hover:opacity-70"
            }`}
          >
            {tab.label}
          </button>
        )}</For>
      </nav>

      {/* 🖼️ MODULAR CONTENT VIEWPORT */}
      <div class="sheet-viewport flex-1 min-h-0 relative overflow-hidden">
        <div class="tab-content animate-fade-in h-full">
          <Switch>
            <Match when={activeTab().layout === '3-col'}>
              <div class="grid grid-cols-[140px_1.2fr_1fr] gap-12 h-full">
                <aside class="col-left"><For each={activeTab().widgets.filter(w => w.slot === 'left')}>{(w) => <WidgetMapper widget={w} />}</For></aside>
                <main class="col-center"><For each={activeTab().widgets.filter(w => w.slot === 'center')}>{(w) => <WidgetMapper widget={w} />}</For></main>
                <aside class="col-right"><For each={activeTab().widgets.filter(w => w.slot === 'right')}>{(w) => <WidgetMapper widget={w} />}</For></aside>
              </div>
            </Match>
            <Match when={activeTab().layout === '2-col-asymmetric'}>
              <div class="grid grid-cols-[1.5fr_1fr] gap-16 h-full">
                <main class="col-main overflow-y-auto pr-8"><For each={activeTab().widgets.filter(w => w.slot === 'main')}>{(w) => <WidgetMapper widget={w} />}</For></main>
                <aside class="col-side overflow-y-auto pr-2"><For each={activeTab().widgets.filter(w => w.slot === 'side')}>{(w) => <WidgetMapper widget={w} />}</For></aside>
              </div>
            </Match>
            <Match when={activeTab().layout === 'tree-grid'}>
              <div class="h-full overflow-y-auto"><For each={activeTab().widgets.filter(w => w.slot === 'main')}>{(w) => <WidgetMapper widget={w} />}</For></div>
            </Match>
          </Switch>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: sheet-fade 0.4s ease-out forwards; }
        @keyframes sheet-fade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        /* Hide scrollbars but allow scrolling */
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(var(--gray), 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
