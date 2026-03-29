const WARPS_STAT_KEYS = ["str", "foc", "ref", "per", "int", "dex", "end"];
const WARPS_PROGRESS_KEYS = ["universalPoints", "combatPoints", "narrativePoints"];
const WarpsActorDocument = CONFIG.Actor.documentClass;
const WarpsActorSheetBase = foundry.applications.sheets.ActorSheetV2;
const WarpsSheetMixin = foundry.applications.api.HandlebarsApplicationMixin;
const WarpsSheetConfig = foundry.applications.apps.DocumentSheetConfig;

class WarpsCharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      stats: new fields.SchemaField({
        str: new fields.NumberField({ initial: 10, integer: true }),
        foc: new fields.NumberField({ initial: 10, integer: true }),
        ref: new fields.NumberField({ initial: 10, integer: true }),
        per: new fields.NumberField({ initial: 10, integer: true }),
        int: new fields.NumberField({ initial: 10, integer: true }),
        dex: new fields.NumberField({ initial: 10, integer: true }),
        end: new fields.NumberField({ initial: 10, integer: true })
      }),
      resources: new fields.SchemaField({
        eff: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0, integer: true }),
          min: new fields.NumberField({ initial: 0, integer: true }),
          max: new fields.NumberField({ initial: 0, integer: true })
        }),
        hp: new fields.SchemaField({
          value: new fields.NumberField({ initial: null, integer: true, nullable: true }),
          min: new fields.NumberField({ initial: 0, integer: true }),
          max: new fields.NumberField({ initial: 0, integer: true })
        })
      }),
      progression: new fields.SchemaField({
        universalPoints: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
        combatPoints: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
        narrativePoints: new fields.NumberField({ initial: 0, integer: true, min: 0 })
      })
    };
  }

  prepareDerivedData() {
    const strength = this.stats.str ?? 0;
    const endurance = Math.max(this.stats.end ?? 0, 0);
    const maxHp = strength * 5;
    const minHp = -maxHp;

    this.resources.eff.min = 0;
    this.resources.eff.max = endurance;
    this.resources.eff.value = Math.clamp(this.resources.eff.value ?? 0, 0, endurance);

    this.resources.hp.max = maxHp;
    this.resources.hp.min = minHp;
    this.resources.hp.value = this.resources.hp.value == null
      ? maxHp
      : Math.clamp(this.resources.hp.value, minHp, maxHp);
  }
}

class WarpsCharacterSheet extends WarpsSheetMixin(WarpsActorSheetBase) {
  static DEFAULT_OPTIONS = {
    classes: ["warps", "sheet", "actor", "character"],
    position: {
      width: 720,
      height: 680
    },
    window: {
      contentClasses: ["standard-form"],
      resizable: true
    },
    form: {
      submitOnChange: true
    }
  };

  static PARTS = {
    sheet: {
      template: "systems/warps/templates/actor/character-sheet.hbs",
      root: true,
      scrollable: [".sheet-grid"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    return Object.assign(context, {
      stats: WARPS_STAT_KEYS.map((key) => ({
        key,
        label: game.i18n.localize(`WARPS.Stats.${key}`),
        value: context.document.system.stats[key]
      })),
      progression: WARPS_PROGRESS_KEYS.map((key) => ({
        key,
        label: game.i18n.localize(`WARPS.Progression.${key}`),
        value: context.document.system.progression[key]
      }))
    });
  }
}

Hooks.once("init", () => {
  console.log("Warps System | INIT");

  CONFIG.Actor.dataModels = {
    character: WarpsCharacterData
  };

  WarpsSheetConfig.unregisterSheet(WarpsActorDocument, "core", WarpsActorSheetBase, {
    types: ["character"]
  });
  WarpsSheetConfig.registerSheet(WarpsActorDocument, "warps", WarpsCharacterSheet, {
    types: ["character"],
    makeDefault: true
  });
});
