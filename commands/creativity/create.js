const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

const isURL = require('../../libs/functions/validateURL')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Will display a form depending on which component you want to create')
    .addSubcommand(builder => builder
      .setName('embed')
      .setDescription('Display a form to create an embed message'))
    .addSubcommand(builder => builder
      .setName('button')
      .setDescription('Display a form to create a button'))
  ,
  async execute(interaction) {
    const element = interaction.options.getSubcommand()
    switch (element) {
      case 'embed': {

        const awareComponentsRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('accept').setLabel('Accept').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setLabel('API: Embeds').setStyle(ButtonStyle.Link)
              .setURL('https://discord-api-types.dev/api/discord-api-types-v10/interface/APIEmbed'))

        interaction.reply({
          content: 'You are about to start a strict form to create embeds, be aware that it\'s really strict bassed on Discord API so you must know these restrinctions.\n' +
            'If there is something wrong in fill out of the form, it will reset completly and all the information you put on, will dissapear.\n' +
            'You can check the restrictions about Embed messages in the following link',
          components: [awareComponentsRow]
        }).then(interactionResponse => interactionResponse.awaitMessageComponent({ time: 15000, filter: i => i.user.id = interaction.user.id }))
          .then(async buttonInteraction => {
            if (buttonInteraction.customId === 'cancel') { interaction.deleteReply(); return }
            else {
              let form = new ModalBuilder()
                .setTitle('Creating ' + element)
                .setCustomId('embedCreatorForm1');

              // Basic embed fields
              const embedFields = {
                Title: new TextInputBuilder()
                  .setCustomId('Title')
                  .setLabel('Title of your embeded message')
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('My Title [256]')
                  .setRequired(false)
                  .setMaxLength(256),
                Description: new TextInputBuilder()
                  .setCustomId('Description')
                  .setLabel('Description of the message')
                  .setStyle(TextInputStyle.Paragraph)
                  .setPlaceholder('My large description [4000]')
                  .setRequired(false),
                Color: new TextInputBuilder()
                  .setCustomId('Color')
                  .setLabel('Hex color code of the embed')
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('#ffffff [7]')
                  .setMaxLength(7)
                  //.setMinLength(7)
                  .setRequired(false),
                Image: new TextInputBuilder()
                  .setCustomId('Image')
                  .setLabel('URL: Big image of the embed')
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('https://www.domain.com/myimage.jpg')
                  .setRequired(false),
                URL: new TextInputBuilder()
                  .setCustomId('URL')
                  .setLabel('URL: External link, for Title or Description')
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('https://discord.gg/J6ybzaTWQK')
                  .setRequired(false)
              }

              for (const field in embedFields) form.addComponents(new ActionRowBuilder().addComponents(embedFields[field]))

              await buttonInteraction.showModal(form)

              return await buttonInteraction.awaitModalSubmit({ time: 100000, filter: i => i.user.id === interaction.user.id, })
                // Handling the data of the modal / form
                .then(async submitted => {
                  // Transform the input collection into an object stored in "input"
                  const input = Object.fromEntries(submitted.fields.fields.map((a, b) => [b, a.value.trim() || null]))
                  // Validates to send something in the embed. Discord wont let anyone send empty embeds
                  if (Object.entries(input).filter(e => e[0] !== "Color").every(e => e[1] === null)) {
                    submitted.reply('You can\'t send an empty embed!')
                    return
                  }
                  const outEmbed = new EmbedBuilder();
                  for (const field in input) {

                    // Validating the input content
                    if (input[field] === null) continue
                    if (field === 'Image' && !isURL(input[field])) {
                      submitted.reply('This **Image URL** isn\'t valid, must be **http/s** and have a correct **domain + source**')
                      submitted.rejected = true
                      continue
                    }
                    if (field === 'Color' && !/^#([a-f0-9]{6})$/i.test(input[field])) {
                      submitted.reply('The HEX you provided do not represents any color, those charactares arent included in HEX (0-f)')
                      submitted.rejected = true
                      continue
                    }
                    if (field === 'URL') {
                      if (!isURL(input[field])) {
                        submitted.reply('This **URL** isn\'t valid, must be **http/s** and have a correct **domain + source**')
                        submitted.rejected = true
                        continue
                      }
                      if (input.Title === null) {
                        if (input.Description === null) input.Description = ''
                        const length = input.Description.length + input[field].length * 2 + 4 /* 4 because of () [] simbols added*/
                        if (length > 4096) {
                          interaction.channel.send(
                            '`LOG: You introduced an URL without a Title, I tried to add it to the Description as an URL but it cant fit in the description (4096 character)`'
                          )
                          continue

                        }
                        input.Description += `\n[${input[field]}](${input[field]})`
                        outEmbed.setDescription(input.Description)
                        continue
                      }
                    }

                    // Setting the properties
                    try {
                      outEmbed['set' + field](input[field])
                    } catch (err) {
                      // Debugging errors
                      submitted.reply(err.message)
                      console.log(err)
                      submitted.rejected = true
                      break;
                    }
                  }

                  if (submitted.rejected) return

                  const outComp = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('convert').setLabel('JSON').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('send').setLabel('Send').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('edit').setLabel('Add more').setStyle(ButtonStyle.Primary))

                  submitted.reply({
                    content: 'This is the structure you asked for. Do you want to continue adding things?\n' +
                      '· You can transform this embed to a JSON file, cant excede 2000 characters including keys and `"` ! (dev porpuses)\n' +
                      '· You can send this embed to a channel (mod propuses)\n' +
                      '· Add more things to the embed (keep editing)', ephemeral: true
                  })
                  return [await interaction.editReply({ content: '', components: [outComp], embeds: [outEmbed] }), submitted]


                })
                .catch((err) => {
                  if (err.message.includes('time'))
                    return buttonInteraction.editReply({ content: 'You had 100 secs to complete the form and no data were submited', components: [] })
                  console.log(err)
                })
            }
          })
          .then(res => {

            if (res === undefined) return
            const message = res[0]
            const submitted = res[1]

            message.awaitMessageComponent({ time: 15000, filter: i => i.user.id = interaction.user.id })
              .then(buttonInteraction => {
                if (buttonInteraction.customId === 'convert') {
                  const jsonTxt = `\`\`\`json\n${JSON.stringify(message.embeds[0], null, 2)}\`\`\``
                  if (jsonTxt.length > 2000) return submitted.editReply('You cant transform this embed to JSON (exceded 2000 characters)')
                  return submitted.editReply(jsonTxt)
                }
                if (buttonInteraction.customId === 'send') {

                }
              })
              .catch(err => submitted.editReply(err.message))

          })
          .catch(err => err.message.includes('time') ? interaction.deleteReply() : void (0))
        break;
      }
      case 'button': {
        interaction.reply('This functionality is not available yet')
      }
    }
  }
}