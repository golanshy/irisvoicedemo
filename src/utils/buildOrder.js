
import { pluck, omit } from 'ramda'
import { steak } from '../../data/sections'

const getSelection = (model, slots, items) =>
  items.find(x => x.name === slots[model.slots.delegateTrigger].value)

const getModifier = modifiers => name =>
  // NOTE remove 0 access
  modifiers[0].modifierOptions.find(x => x.name === name)

const mapModifiers = (selections, modifiers) =>
  selections.map(getModifier(modifiers))

const transformOptions = ({ modifierOptionCode: code, code: value  }) =>
  ({ code, value })

const buildOrder = model => (slots, items) => {
  const mainSelection = getSelection(model, slots, items)
  const { itemCode, modifiers, code } = mainSelection || {}


  const modifierSelections = pluck('value', Object.values(omit([ model.slots.delegateTrigger ], slots)))
  const modifierOptions = mapModifiers(modifierSelections, modifiers)



  return {
    categoryItems: [
      {
        itemCode: steak,
        quantity: 1,
        options: modifierOptions.map(transformOptions)
      }
    ],
    checkout: {
      deliveryDateTime: new Date().toISOString(),
      isDeliveryDateTimeUtc: true,
    },
    justValidateDeliveryTime: false
  }
}

export default buildOrder
