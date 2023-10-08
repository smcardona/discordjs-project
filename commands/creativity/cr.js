const { Message } = require('discord.js')
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  Collection
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cr')
    .setDescription('Quenstions to create an element'),
  guildOnly: true,
  async execute(interaction) {
    let outEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setDescription('No data yet')

    interaction.reply({
      content: 'You are about to start a strict form to create embeds, be aware that it\'s really strict bassed on Discord API so you must know these restrinctions.\n' +
        'If there is something wrong in fill out of the form, it will reset completly and all the information you put on, will dissapear.\n' +
        'You can check the restrictions about Embed messages in the following link',
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('accept').setLabel('Accept').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setLabel('API: Embeds').setStyle(ButtonStyle.Link)
              .setURL('https://discord-api-types.dev/api/discord-api-types-v10/interface/APIEmbed'))
      ]
    }).then(interactionResponse => interactionResponse.awaitMessageComponent({ time: 15000, filter: i => i.user.id = interaction.user.id }))
      .then(async buttonInteraction => {
        if (buttonInteraction.customId === 'cancel') { return interaction.deleteReply() }
        if (buttonInteraction.customId === 'accept') {
          const embedFields = require('../../libs/objects/embedFields')

          /* Updates the first interaction reply */
          interaction.editReply({ content: '', embeds: [outEmbed], components: [] })

          let inputLength = 0
          /**
           * Collects messages after showing the require prompt
           * @param {ButtonInteraction} _interaction Interaction message to reply and collect the message
           * @param {Object} field Field object with description and requirements
           * @param {String} fieldName Field name that will be sent in the message
           * @param {Number} time Time in seconds to wait for collecting the message
           * @returns {Message | null} Returns the message collected or null if no collection
           */
          async function showPromptAndCollect(_interaction, field, fieldName, time = 60) {
            /* Sending the prompt */
            const output = `**Embed**\nYou cant send more than 6000 characters in total with your embed. You have \`${inputLength}/6000\`\n` +
              `You also have <t:${Math.floor(Date.now() / 1000) + time}:R> to respond\n` +
              'You can skip this field by typing `<sk>`, or even end this command with `<end>`\n' +
              `**#${fieldName}**\nBe aware of:\n\t· ${field.require.join('\n\t· ')}`

            if (_interaction.replied) {
              /* response = Message */
              await _interaction.editReply({ content: output, ephemeral: true });
            } else {
              /* response = InteractionResponse : ButtonInteraction */
              await _interaction.reply({ content: output, ephemeral: true });
            }

            /* Collecting a message */
            const filter = m => m.author.id === interaction.user.id;
            try {
              const collected = await _interaction.channel.awaitMessages({ filter, max: 1, time: (time * 1000) });

              if (collected.size === 0) return null

              return collected.first()
            } catch (err) {
              console.log(err);
              return null
            }
          }

          async function handleInput() {
            const fcf = Object.keys(embedFields);
            /* First common fields input */
            for (let i = 0; i < fcf.length; i++) {
              const field = fcf[i];
              const message = await showPromptAndCollect(buttonInteraction, embedFields[field], field);

              if (message === null) continue

              /* Handling input */
              const text = message.content
              message.delete()
              if (text === '<end>') break
              if (text === '<sk>') continue

              const response = await embedFields[field].handler(text, outEmbed, showPromptAndCollect, buttonInteraction, inputLength, interaction)

              // This means the response has a sting that might be an error. No news, good news
              if (response && typeof response === 'string') {
                await interaction.channel.send(response)
                continue
              }
              // If handler returns true, it means it shouldnt be added handled again for the next lines
              if (response === true) continue

              /* Setting embed property */
              await outEmbed['set' + field](text)
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
}