const jsdom = require("jsdom");
const { JSDOM } = jsdom;

(async () => {
  // get URL DOM
  try {
    const response = await fetch(
      "https://docs.google.com/document/d/e/2PACX-1vSHesOf9hv2sPOntssYrEdubmMQm8lwjfwv6NPjjmIRYs_FOYXtqrYgjh85jBUebK9swPXh_a5TJ5Kl/pub"
    );
    const text = await response.text();
    const dom = new JSDOM(text);
    const doc = dom.window.document;

    // find table in DOM
    const table = doc.getElementsByTagName("table")[0];

    // create array of coordinates and min/max values
    let coordArr = [];

    let xlength = 0;
    for (let i = 1; i < table.rows.length; i++) {
      if (parseInt(table.rows.item(i).cells.item(0).textContent) > xlength) {
        xlength = parseInt(table.rows.item(i).cells.item(0).textContent);
      }
    }

    let ylength = 0;
    for (let i = 1; i < table.rows.length; i++) {
      if (parseInt(table.rows.item(i).cells.item(2).textContent) > ylength) {
        ylength = parseInt(table.rows.item(i).cells.item(2).textContent);
      }
    }

    // build out coordinate array by parsing table rows
    for (let x = 0; x <= xlength; x++) {
      for (let y = 0; y <= ylength; y++) {
        for (let i = 1; i < table.rows.length; i++) {
          if (
            parseInt(table.rows.item(i).cells.item(0).textContent) == x &&
            parseInt(table.rows.item(i).cells.item(2).textContent) == y
          ) {
            coordArr.push([x, y, table.rows.item(i).cells.item(1).textContent]);
            let exists = coordArr.findIndex(
              (coord) => coord[0] == x && coord[1] == y && coord[2] == " "
            );
            if (exists != -1) {
              coordArr.splice(exists, 1);
            }
          } else if (
            !coordArr.find((coord) => coord[0] == x && coord[1] == y)
          ) {
            coordArr.push([x, y, " "]);
          }
        }
      }
    }

    // print lines from coordinate array
    for (let y = ylength; y >= 0; y--) {
      let line = "";
      for (let x = 0; x < xlength; x++) {
        for (let i = coordArr.length - 1; i >= 0; i--) {
          if (coordArr[i][0] == x && coordArr[i][1] == y) {
            line += coordArr[i][2];
          }
        }
      }
      console.log(line);
    }
  } catch (error) {
    console.error(error);
  }
})();
