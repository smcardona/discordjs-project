const sumarBins = {
  process: {
    /**
     * @param {Array} toC List of nums to calc the max
     * @returns {Number} The biggest number of Array elements length
     */
    maxDig(toC) {
      let m = 0;
      for (i in toC) { if (toC[i].length > m) { m = toC[i].length; }; } return m;
    },

    /**
     * Adds '?' at the start of the elements to equalize their length
     * @param {Array} toC List of strings to be filled
     * @param {Number} m Length of the longest number
     */
    fill(toC, m) {
      for (i in toC) {
        toC[i] = toC[i].padStart(m, '?')
      }
    },

    /**
     * Rotates the elements of the Array 90 degrees
     * @param {Array} toE Elements to be rotated
     * @param {Number} opt 1 for left rotation, null for right rotation
     * @returns {Array} An array with the elements rotated
     */
    schematize(toE, opt) {
      let m = sumarBins.process.maxDig(toE) // Calcs biggest length
      sumarBins.process.fill(toE, m) // Equalize their length with ?
      let ot = []; let lv = []
      for (let i = 1; i <= m; i++) {
        if (opt === 1) { // 90º to the left
          for (e in toE) { lv.push(toE[e][m - i]) } ot.push(lv)
        } else {  // 90º to the right
          for (e in toE) { lv.unshift(toE[e][m - i]) } ot.unshift(lv)
        } lv = []
      } return ot
    },

    /**
     * Logs in console a readable ressult of the schema, dev tool
     * @param {Schema} sch Schema ressult 
     */
    logS(sch) {
      console.log('Schema')
      sch.forEach(lv => console.dir(lv))
    },

    /**
     * Entry schema should be : [[Column of nums 1], [Column of nums 2], ...]
     * @param {Schema} sch Calculates the binary ressult from the entries
     * @returns {Array} Ressult : [1 || 0 , ...]
     */
    calc(sch) {
      let res = [];
      for (let lv = 0; lv < sch.length; lv++) {
        sch[lv].forEach((n, i) => {
          let nN = sch[lv][i + 1] // Next Number
          // 0 + 0 = 0
          if (n == '0' && nN == '0') sch[lv][i + 1] = '0'
          // 1 + 1 = 10
          else if (n == '1' && nN == '1') {
            sch[lv][i + 1] = '0'
            // Takes 1 to a next level
            if (sch[lv + 1] == undefined) sch.push(['1']); else sch[lv + 1].unshift('1');
          }
          // value + !value = ...
          else if ((n == '1' || n == '0') && nN != n) {
            switch (nN) {
              case '1': case '0': sch[lv][i + 1] = '1'; break // 1 + 0 || 0 + 1
              case undefined: res.unshift(n); break // This means this number is a ressult
              case '?': sch[lv][i + 1] = n; break // This means next number exist but 0
            }
          }
          // ? + any = ok
          else if (n == '?') void (0)
          // Unespected value
          else {
            /* This happened when there were errors, but not anymore. I believe so
            console.log(`Se ha detectado un numero no binario: ${n}: ${[lv, i]}, ${nN}: ${[lv, i+1]}`) */
          }
        })
      } return res;
    },

    /**
     * Joins the lists inside the entry list
     * @param {Array} li List of lists to be joined
     * @returns {Array} An array with all the elements inside joined in a single string
     */
    simp(li) {
      for (i in li) { li[i] = li[i].join('') } return li
    },

    /**
     * Translates the characters of a list of strings
     * @param {Array} obj ['0 || 1 || ?', '0 || 1 || ?', ...]
     * @returns {Array}
     */
    trs(obj) {
      for (ln in obj) {
        obj[ln] = obj[ln].split('');
        for (i in obj[ln]) {
          let rn = obj[ln][i];
          if (rn == '1') obj[ln].splice(i, 1, '⬜')
          else if (rn == '0') obj[ln].splice(i, 1, '⬛')
          else if (rn == '?') obj[ln].splice(i, 1, '⬛')
        }
      } return sumarBins.process.simp(obj)
    }
  }
}

module.exports = sumarBins.process