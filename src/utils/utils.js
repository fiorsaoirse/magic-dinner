export const isTagNode = (item) => item?.type === 'tag';

export const isTextNode = (item) => item?.type === 'text';

const replaceCode = (string, code, replacer) => {
    const re = new RegExp(String.fromCharCode(code), 'g');
    return string.replace(re, replacer);
};

export const formatText = (string) => replaceCode(
    replaceCode(string, 160, ' '),
    8209, '-',
);
