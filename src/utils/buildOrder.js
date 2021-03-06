
import { pluck, omit } from 'ramda'
import { steak } from '../../data/sections'
import lower from './lower'

const getSelection = (model, slots, items) =>
  items.find(x => lower(x.name) === lower(slots[model.mainSelection].value))

const getModifier = modifiers => name =>
  // NOTE remove 0 access
  modifiers[0].modifierOptions.find(x => lower(x.name) === lower(name))

const mapModifiers = (selections, modifiers) =>
  selections.map(getModifier(modifiers))

const transformOptions = ({ modifierOptionCode: code, code: value  }) =>
  ({ code, value })

const buildOrder = model => (slots, items) => {
  const mainSelection = getSelection(model, slots, items)
  const { modifiers } = mainSelection || {}

  const modifierSelections = pluck('value', Object.values(omit([ model.mainSelection ], slots))).filter(x => !!x)
  const modifierOptions = mapModifiers(modifierSelections, modifiers).filter(x => !!x)

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
