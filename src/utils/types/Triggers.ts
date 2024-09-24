import { ClientEvents } from "discord.js"
import { Bot } from "../../bot.js"

export type Trigger = {
    name: string
    description?: string
    event: keyof ClientEvents
    conditionCheck: ConditionCheck
    execute: TriggerExecutor
}

type ConditionCheck = (bot: Bot, ...args: any) => boolean | Promise<boolean>;
type TriggerExecutor = (bot: Bot, ...args: any) => void | Promise<void>;