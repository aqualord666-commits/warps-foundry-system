const WARPS_STAT_KEYS = ["str", "foc", "ref", "per", "int", "dex", "end"];
const WARPS_PROGRESS_KEYS = ["universalPoints", "combatPoints", "narrativePoints"];
const WarpsActorDocument = CONFIG.Actor.documentClass;
const WarpsActorSheetBase = foundry.applications.sheets.ActorSheetV2;
const WarpsSheetMixin = foundry.applications.api.HandlebarsApplicationMixin;
const WarpsSheetConfig = foundry.applications.apps.DocumentSheetConfig;

function getWarpsResourceBounds(system) {
  const strength = Math.max(system.stats?.str ?? 0, 0);
  const endurance = Math.max(system.stats?.end ?? 0, 0);
  const maxHp = strength * 5;
  const minHp = -maxHp;
  const hpValue = system.resources?.hp?.value;
  const effValue = system.resources?.eff?.value ?? 0;

  return {
    hp: {
      min: minHp,
      max: maxHp,
      value: hpValue == null ? maxHp : Math.clamp(hpValue, minHp, maxHp)
    },
    eff: {
      min: 0,
      max: endurance,
      value: Math.clamp(effValue, 0, endurance)
    }
  };
}

class WarpsCharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      stats: new fields.SchemaField({
        str: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        foc: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        ref: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        per: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        int: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        dex: new fields.NumberField({ initial: 10, integer: true, min: 0 }),
        end: new fields.NumberField({ initial: 10, integer: true, min: 0 })
      }),
      resources: new fields.SchemaField({
        eff: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0, integer: true, min: 0 })
        }),
        hp: new fields.SchemaField({
          value: new fields.NumberField({ initial: null, integer: true, nullable: true })
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
    const resourceBounds = getWarpsResourceBounds(this);

    this.resources.eff.value = resourceBounds.eff.value;
    this.resources.hp.value = resourceBounds.hp.value;
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
      resourceBounds: getWarpsResourceBounds(context.document.system),
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

  WarpsSheetConfig.registerSheet(WarpsActorDocument, "warps", WarpsCharacterSheet, {
    types: ["character"],
    makeDefault: true
  });
});
