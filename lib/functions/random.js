const commonRandom = (max = 1) => Math.floor(Math.random() * max)


/**
 * Generates random numbers with an interval, it doesnt matter wich interval is higher
 * @param {Number} a - First interval
 * @param {Number} b - Second interval
 * @returns {Number} Random number between the interval
 */
function random(a = 1, b = 0) {
  let max, min
  if (a >= b) [max, min] = [a, b]; else[min, max] = [a, b]
  return a == 1 && b == 0 ? commonRandom() : commonRandom(max - min) + min
}

module.exports.random = random

/**
 * Selects elements from an Array, can select more than one but could be the same element
 * @param {Array} arr - List of elements to be selected
 * @param {Number} items Amount of elements to be selected
 * @returns {Array} Elements selected randomly, will return an Array of elements if items > 1
 */
function pickRandom(arr, items = 1) {
  if (items <= 1) return [arr[commonRandom(arr.length)]]
  let ret = []
  for (let i = 0; i < items; i++) ret[i] = pickRandom(arr)
  return ret
}

module.exports.pickRandom = pickRandom

/**
 * Extracts elements from an array and returns them inside another array
 * @param {Array} arr - List of elements to extract random ones
 * @param {Items} items - Amount of elements to be extracted
 * @returns {Array} Array of random extracted elements
 */
function extractRandom(arr, items = 1, seeder = commonRandom, affected = true) {
  affected ? affected = arr : affected = [...arr]
  if (items <= 1) return affected.splice(seeder(affected.length), 1)
  let ret = []
  for (let i = 0; i < items; i++) ret[i] = affected.splice(seeder(affected.length), 1)[0]
  return ret
}

module.exports.extractRandom = extractRandom

/**
 * Disorders the elements of the Array and returns a new Array if @param affected is true, otherwise
 * will return the Array disordered
 * @param {Array} arr - List of elements to be disordered
 * @param {Function} seeder - RNG seeded to a string
 * @param {Boolean} affected - If true, will change the elements of the array, else it will return a different array
 * @returns {Array} Array of disordered elements 
 */
function disorder(arr, seeder = Math.random, affected = false) {
  affected ? affected = arr : affected = [...arr]
  return affected.sort(() => seeder() - .5)
}

module.exports.disorder = disorder
