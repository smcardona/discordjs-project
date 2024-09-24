// TODO: this code sucks, it is old, from when i started understanding promises, so this is a bad example of it. 
// TODO: REWORK ALL THE CODE IN HERE AND IN embedFields

import {  ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, CommandInteraction, InteractionEditReplyOptions, ButtonInteraction, TextChannel } from 'discord.js'
import { CommandBuilder } from '../../utils/classes/CommandBuilder'
import embedFields, { PromptAndCollector }  from '../../utils/objects/embedFields'
import Command from '../../utils/classes/Command'
import { InTextChannel, Message } from '../../utils/types/Command';

export default new CommandBuilder()
  .setName('cr')  
  .setDescription('Quenstions to create an element')
  .setTextChannelOnly()
  .setInteractionExecutor(
    async function ({ interaction }) {
      let outEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription('No data yet')
  
      interaction.reply({
        content: 'You are about to start a strict form to create embeds, be aware that it\'s really strict bassed on Discord API so you must know these restrinctions.\n' +
          'If there is something wrong in fill out of the form, it will reset completly and all the information you put on, will dissapear.\n' +
          'You can check the restrictions about Embed messages in the following link',
        components: [
          new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
              new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('accept').setLabel('Accept').setStyle(ButtonStyle.Danger),
              new ButtonBuilder().setLabel('API: Embeds').setStyle(ButtonStyle.Link)
                .setURL('https://discord-api-types.dev/api/discord-api-types-v10/interface/APIEmbed'))
        ]
      }).then(interactionResponse => interactionResponse.awaitMessageComponent({ time: 15000, filter: i => i.user.id === interaction.user.id }))
        .then(async receivedInteraction => {
          const buttonInteraction = receivedInteraction as ButtonInteraction;
          if (buttonInteraction.customId === 'cancel') { return interaction.deleteReply() }
          if (buttonInteraction.customId === 'accept') {
  
            /* Updates the first interaction reply */
            interaction.editReply({ content: '', embeds: [outEmbed], components: [] })
  
            let inputLength = 0
            
            
  
            async function handleInput() {
              /* First common fields input */
              for (let field in embedFields) {
                const message = await showPromptAndCollect(buttonInteraction, embedFields[field], field, inputLength);
  
                if (message === null) continue // out of time = next field
  
                /* Handling input */
                const text = message.content
                message.delete()
                if (text === '<end>') break
                if (text === '<sk>') continue
                try {
                
                  const handled = await embedFields[field].handler?.(text, outEmbed, showPromptAndCollect, buttonInteraction, inputLength, interaction);

                  // If handler returns true, it means it was already set, so it avoids doing extra set on the next lines of code
                  if (handled) continue;
                  
                } catch (error: any) {
                  // the handler might throw an error with the text to tell the user
                  await interaction.channel!.send(error);

                }
  
                /* Setting embed property */
                // note: i had no idea how to do this on ts. github copilot did this.
                const method = `set${field}` as keyof EmbedBuilder;
                if (typeof outEmbed[method] === 'function') {
                  (outEmbed[method] as (arg: string) => EmbedBuilder)(text);
                }
                /* End of each input */
                await interaction.editReply({ embeds: [outEmbed] })
                inputLength += text.length
              }
  
              /* Cleaning the chat of ugly prompts */
              buttonInteraction.deleteReply()
  
            }
  
            await handleInput();
  
          }
        })
        .catch(err => err.message.includes('time') ? interaction.deleteReply() : console.log(err))
    }
  ).build() as Command;
  
/**
 * Collects messages after showing the require prompt
 * @param _interaction Interaction message to reply and collect the message
 * @param field Field object with description and requirements
 * @param fieldName Field name that will be sent in the message
 * @param inputLength Accumulator that represents the total characters on the payload values of the embed
 * @param time Time in seconds to wait for collecting the message
 * @returns The message collected or null if no collection
 */
const showPromptAndCollect: PromptAndCollector = async (
  _interaction, field , fieldName, inputLength: number, time = 60
) => {
  const channel = _interaction.channel as TextChannel;
  /* Sending the prompt */
  const output = `**Embed**\nYou cant send more than 6000 characters in total with your embed. You have \`${inputLength}/6000\`\n` +
    `You also have <t:${Math.floor(Date.now() / 1000) + time}:R> to respond\n` +
    'You can skip this field by typing `<sk>`, or even end this command with `<end>`\n' +
    `**#${fieldName}**\nBe aware of:\n\t· ${field.require.join('\n\t· ')}`
  
  if (_interaction.replied) {
    /* response = Message */
    await _interaction.editReply({ content: output, ephemeral: true } as InteractionEditReplyOptions);
  } else {
    /* response = InteractionResponse : ButtonInteraction */
    await _interaction.reply({ content: output, ephemeral: true });
  }

  /* Collecting a message */
  const filter = (m: Message) => m.author.id === _interaction.user.id;
  try {
    const collected = await channel.awaitMessages({ filter, max: 1, time: (time * 1000) });

    if (collected.size === 0) return null

    return collected.first()!
  } catch (err) {
    console.log(err);
    return null
  }
}
  
  
  