import { Events } from "discord.js";
import { Event } from "../../utils/types/Events.js";


export default {
    name: Events.MessageCreate,
    async execute (bot, message) {

        const triggers = bot.triggers.get(this.name);

        if (!triggers) return;

        for (const trigger of triggers) {
            // todo: prepare trigger, with trigger_checks


            if (trigger.conditionCheck(bot, message)) 
                trigger.execute(bot, message)
        }

    }
} as Event;