// This whole code is made to clean a bit the code in the command create embed

import { ButtonInteraction, CommandInteraction, EmbedBuilder, Message } from 'discord.js'
import isURL from '../functions/validateURL'

export type GeneralEmbedField = {
  description: string
  require: string[]
  value?: any
  max_length?: number
  /**
   * User input handler that verifies the text is valid for the field.
   * Does extra stuff too, kinda impure
   * @param text Input content
   * @param resultEmbed Embed to modify in case its needed
   * @param promptAndCollect Function to request more imputs
   * @returns idk
   */
  handler?: (
    text: string, 
    resultEmbed: EmbedBuilder,
    promptAndCollect: PromptAndCollector,
    interaction: CommandInteraction | ButtonInteraction,
    inputLength: number,
    firstInteraction: CommandInteraction
  ) => boolean | Promise<boolean>
};

export type PromptAndCollector = (
  interaction: CommandInteraction | ButtonInteraction,
  field: GeneralEmbedField,
  fieldName: string,
  inputLength: number,
  time?: number
) => Promise<Message<boolean> | null>;

/* type EmbedFields = {
  Title: GeneralEmbedField;
  Description: GeneralEmbedField;
  Color: GeneralEmbedField;
  Image: GeneralEmbedField;
  URL: GeneralEmbedField;
  Fields: GeneralEmbedField;
}; */
type EmbedFields = {
  [key: string]: GeneralEmbedField
}

const embedFields: EmbedFields = {
  Title: {
    description: 'Bold big text line of the embed',
    require: ['256 maximum characters'],
    handler: (text: string) => {
      if (text.length > 256) throw 'You cant send more than 256 characters for the title'
      // This boolean represents an Error, text = error, false = good
      // Like linux commands, no news good news
      return false
    },
  },
  Description: {
    description: 'Normal text, big paragraph of the embed',
    require: ['4096 maximum characters', 'You can create a link like this `[display](url)`'],
    handler: (text: string) => {
      if (text.length > 4096) throw 'You cant send more than 4096 characters for the description'
      return false
    }
  },
  Color: {
    description: 'Colored left line of the embed',
    require: ['7 maximum characters', 'HEX code', 'Syntax: `#[0-9,a-f,A-F]{6}`', 'Example: `#00ff00`'],
    value: '#000000',
    handler: (text: string, outEmbed: EmbedBuilder, _x, _y, _z, _interaction) => {
      if (!/^#([a-f0-9]{6})$/i.test(text)) {
        outEmbed.setColor(0x000000)
        _interaction.editReply({ embeds: [outEmbed] })
        throw 'The **HEX** you provided do not represents any color, those charactares arent included in HEX **(0-f)**'
      }
      return false
    }
  },
  Image: {
    description: 'Big Image of the embed',
    require: ['Valid Image displaying URL', 'Syntax: `http|https://any.domain/source`'],
    handler: (text: string) => {
      if (!isURL(text)) throw 'This **Image URL** isn\'t valid, must be **http/s** and have a correct **domain + source**'
      return false
    }
  },
  URL: {
    description: 'URL linked to the title or at the end of the description field',
    require: ['Title required', 'If there is no title, the URL will be added at the end of the line as: `[url](url)`. This will increase characters'],
    handler: async (text, outEmbed, _1, _2, _3, _interaction) => {
      if (!isURL(text)) throw 'This **URL** isn\'t valid, must be **http/s** and have a correct **domain + source**'

      //? URLs on embeds are linked to the title, so they require to be a title
      if (outEmbed!.data.title === undefined) {
        //? In this case, these values mean the description is the template or undefined
        if ([undefined, 'No data yet'].includes(outEmbed!.data.description)) outEmbed.data.description = ''
        const length = outEmbed.data.description!.length + text.length; /* 4 because of () [] simbols added*/
        //? Here the bot tries to insert the url into the description but only if it fits
        if (length > 4096) throw 'You introduced an URL without a Title, I tried to add it to the Description as an URL but it cant fit in the description (4096 character)'
        outEmbed.data.description += text; // `\n[${text}](${text})`
        return true; // Handled this way
      }

      return false;
    }
  },
  Fields: {
    description: '**Quantity of fields** that will be added to the embed\nA field is a separated block',
    require: ['25 Fields maximum', 'The input must be a number, not letter number', 'The characters you input for field also counts for the total',
      'While adding the input of fields, you wont be able to <end>'],
    /**
     * Handles the input depending on the field
     * @param text Input collected from user
     * @param outEmbed Embed Object to modify if needed
     * @param showPromptAndCollect Input collector function, could be needed
     * @param interaction Interaction Object to reply
     * @param inpLength Length of the acumulated input of the user
     * @param  _interaction First interaction that contains the embed
     * @returns  Error message string or false if there was no errors
     */
    async handler (text, outEmbed, showPromptAndCollect, interaction, inpLength, _interaction){
      const quantity = Number(text)
      if (!Number.isInteger(quantity)) throw 'I only accept whole numbers, not any letters or decimals. `[0-9]  !!! no [a-z]`'
      for (let i = 0; i < quantity; i++) {
        const fields = Object.keys(fieldProperties);
        const fieldData: any = {};

        // I know this is wrong sorry 😭😭
        for (const fieldName of fields) {
          const field = fieldProperties[fieldName]
          const message = await showPromptAndCollect(interaction, field, i + ' Field ' + fieldName, inpLength);
          if (message === null) throw 'You must send content for name and value, and even type something for inline'

          const content = message.content;
          message.delete()
          // If the input has a max length restriction, this will check the content lenght
          if (field.max_length) if (content.length > fieldProperties[fieldName].max_length!) 
            throw `You cant send more than **${field.max_length} characters** for this **Field ${fieldName}**`
          // Special case for inline, only 'true' is really true
          if (fieldName === 'inline') {
            fieldData[fieldName] = (content.toLowerCase() == 'true')
            continue
          }
          inpLength += content.length
          fieldData[fieldName] = content

        }
        // When the field is done, its applied ot the embed and the first interaction is updated 
        outEmbed.addFields(fieldData)
        _interaction.editReply({ embeds: [outEmbed] })
      }

      // This time I return true so it wont try to add any value to a field again, this will prevent an error
      return true
    },
    
  }
};

export default embedFields;

const fieldProperties: { [key: string]: {
  description: string;
  require: string[];
  max_length?: number;
}} = {
  name: {
    description: 'Secondary block title',
    require: ['256 maximum characters', 'REQUIRED, this field wont add if not typed'],
    max_length: 256
  },
  value: {
    description: 'Secondary paragraph',
    require: ['1026 maximum characters', 'REQUIRED, field wont add if it doesnt has both name and value'],
    max_length: 1026
  },
  inline: {
    description: 'Whether or not this field should display in the same line with next fields',
    require: ['Boolean', 'Value here must be either `true` or `false`', 'You can <sk> this', 'Default: False',
      'Default value will apply if the input isnt valid or if there is no even input']
  }
}