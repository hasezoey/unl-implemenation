export const whiteSpace = /\s/i;

export const numbers = /[0-9]/i;

export const namesStartWith = /[a-z_]/i;
export const namesUntilEnd = /[a-z0-9_]/i;

export const newLine = /\n|\r|\r\n/i;

export const newLineOrSemi = /\n|\r|;|\r\n/i;

export const assignOperator = /(?<![=!<>])=(?![=<>])/i;

export const strings = /"|`/i;

export const fullLineComment = /\/\//i; // matches "//"

export const inLineCommentStart = /\/\*/i; // matches "/*"
export const inLineCommentEnd = /\*\//i; // matches "*/"
