Hooks.once("init", () => {
  console.log("Warps System | INIT");

  CONFIG.Actor.dataModels = {
    character: class WarpsCharacterData extends foundry.abstract.TypeDataModel {
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
  };
});
