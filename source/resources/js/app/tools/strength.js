"use strict";

const zxcvbn = require('zxcvbn');
const colors = [
	"#D01118",
	"#D35400",
	"#E67E22",
	"#F39C12",
	"#2ECC71"
]
/**
 * Check password strength
 * @param  {string} pass
 * @return {object}
 */
export function strengthCheck(password) {
    let result = zxcvbn(password);

    let object = {
    	"time": result.crack_time_display,
    	"color": colors[result.score],
    	"score": result.score
    }

    return object;
}
