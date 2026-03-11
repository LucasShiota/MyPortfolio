---
entryType: "tab"
id: "STATS"
label: "Character Sheet"
order: 1
gridTemplate: "140px 1.2fr 1fr"
sections:
  - component: "Abilities"
    options:
      placement: "1"
      title: "Core Attributes"
    props:
      abilities:
        - name: "EXE"
          label: "Execution"
          value: 18
          mod: "+4"
        - name: "FLW"
          label: "Flow"
          value: 16
          mod: "+3"
        - name: "ARC"
          label: "Architecture"
          value: 14
          mod: "+2"
        - name: "SYS"
          label: "Logic"
          value: 19
          mod: "+4"
        - name: "NAR"
          label: "Narrative"
          value: 15
          mod: "+2"
  - component: "Skills"
    options:
      placement: "2"
      title: "Base Proficiencies"
    props:
      skills:
        - label: "Astro / Frameworks"
          level: 3
        - label: "SolidJS / Reactivity"
          level: 2
        - label: "GSAP / Motion"
          level: 3
        - label: "Shader Programming"
          level: 1
        - label: "UI / UX Design"
          level: 3
        - label: "System Math"
          level: 2
  - component: "Inventory"
    options:
      placement: "3"
      title: "Loot & Equipment"
    props:
      items:
        - "⚔️ Masterwork Mechanical Keyboard"
        - "💎 Potion of Unlimited Coffee"
        - "📖 Ancient Scroll of StackOverflow"
        - "🛡️ Shield of Prettier & ESLint"
---
