import fs from 'node:fs';
import path from 'node:path';
import { Bot } from '../bot';
const baseBot = Bot.getBaseInstance();

export async function loadTriggers(bot: Bot = baseBot) {

    console.log('Loading triggers executors'.bgCyan);
    const triggersPath = path.join(__dirname, '..', 'triggers', 'executors');
    const triggerFiles = fs.readdirSync(triggersPath).filter(f => f.endsWith(".js"));

    for (const file of triggerFiles) {
        const trigger = (await import(path.join(triggersPath, file))).default;

        if (bot.triggers.has(trigger.event))
            bot.triggers.get(trigger.event)!.push(trigger);
        else
            bot.triggers.set(trigger.event, [trigger]);

        console.log(`\t${trigger.name} on '${trigger.event}'`.green);
    }

    // This is basically a copy paste from event_loader, but well, technically these events are reserved only for the triggers
    console.log('Loading trigger listeners'.bgCyan);
    const listenersPath = path.join(__dirname, '..', 'triggers', 'listeners');
    const listenerFiles = fs.readdirSync(listenersPath).filter(f => f.endsWith(".js"));

    for (const file of listenerFiles) {
        const listener = (await import(path.join(listenersPath, file))).default;

        const callType = listener.once ? "once" : "on";
        bot[
            callType
        ](listener.name, (...params) => listener.execute(bot, ...params));

        const triggers = bot.triggers.get(listener.name) ?? [];

        console.log(`\t${listener.name} listening for => ${triggers.length} triggers`.green)
        for (let trigger of triggers)
            console.log(`\t --- ${trigger.name}`.blue)

    }


}