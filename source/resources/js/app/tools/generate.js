"use strict";

//import passgen from 'password-generator';

const passgen = require('password-generator');

const maxLength = 24,
    minLength = 18,
    uppercaseMinCount = 3,
    lowercaseMinCount = 3,
    numberMinCount = 2,
    specialMinCount = 2,
    UPPERCASE_RE = /([A-Z])/g,
    LOWERCASE_RE = /([a-z])/g,
    NUMBER_RE = /([\d])/g,
    SPECIAL_CHAR_RE = /([\?\-])/g,
    NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
    var uc = password.match(UPPERCASE_RE);
    var lc = password.match(LOWERCASE_RE);
    var n = password.match(NUMBER_RE);
    var sc = password.match(SPECIAL_CHAR_RE);
    var nr = password.match(NON_REPEATING_CHAR_RE);
    return password.length >= minLength &&
        !nr &&
        uc && uc.length >= uppercaseMinCount &&
        lc && lc.length >= lowercaseMinCount &&
        n && n.length >= numberMinCount &&
        sc && sc.length >= specialMinCount;
}

/**
 * Generate password
 * @param  {int=} length
 * @return {string}
 */
export function generatePassword(length) {
    let password = "";
    const randomLength = length || Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    while (!isStrongEnough(password)) {
        password = passgen(randomLength, false, /[\w\d\?\-]/);
    }
    return password;
}
