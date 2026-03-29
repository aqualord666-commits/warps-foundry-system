Hooks.once("init", () => {
  console.log("Warps System | INIT");

  CONFIG.Actor.dataModels = {
    character: class WarpsCharacterData extends foundry.abstract.TypeDataModel {
      static defineSchema() {
        const fields = foundry.data.fields;

        return {
          stats: new fields.SchemaField({
            str: new fields.NumberField({ initial: 10, integer: true }),
            agi: new fields.NumberField({ initial: 10, integer: true }),
            int: new fields.NumberField({ initial: 10, integer: true })
          }),
          hp: new fields.SchemaField({
            value: new fields.NumberField({ initial: 10, integer: true }),
            max: new fields.NumberField({ initial: 10, integer: true })
          })
        };
      }
    }
  };
});