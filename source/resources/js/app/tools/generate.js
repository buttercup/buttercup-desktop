"use strict";

const passgen = require('password-generator');

/**
 * Generate password
 * @param  {int} length
 * @param  {bool} memorable
 * @return {string}
 */
export function generatePassword(length, memorable) {
    let result = passgen(length, memorable);

    return result;
}
