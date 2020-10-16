const charCodeMapper = {
    160: ' ',
    8209: '-',
};

const getReplacerByCode = (code) => charCodeMapper[code];

const replaceCharCode = (string, code) => {
    const replacer = getReplacerByCode(code);
    const regexp = new RegExp(String.fromCharCode(code), 'g');
    return string.replace(regexp, replacer);
};

export default (text) => Object.keys(charCodeMapper).reduce(replaceCharCode, text);
