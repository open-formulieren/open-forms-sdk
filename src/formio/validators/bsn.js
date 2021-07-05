const isValidBsn = (value) => {
    if (value.length !== 9) {
      return false;
    }

    // Formula taken from https://nl.wikipedia.org/wiki/Burgerservicenummer#11-proef
    const elevenTestValue = (9 * parseInt(value[0])) + (8 * parseInt(value[1])) + (7 * parseInt(value[2])) +
                            (6 * parseInt(value[3])) + (5 * parseInt(value[4])) + (4 * parseInt(value[5])) +
                            (3 * parseInt(value[6])) + (2 * parseInt(value[7])) + (-1 * parseInt(value[8]));

    return elevenTestValue % 11 === 0;
};

export default isValidBsn;
