"use strict";

// Electron
import swal from 'sweetalert';

/**
 * Show a confirmation dialog with Yes/No buttons
 * @param  {string} message
 * @param  {string} detail
 * @return {boolean}
 */
export function confirmDialog(message, detail, button, callback) {
	button = button || "Delete";
    swal({
    	title: message,
   		text: detail,
   		type: "warning",
   		showCancelButton: true,
   		confirmButtonColor: "#DD6B55",
   		confirmButtonText: button,
   		cancelButtonText: "Cancel"
   	}, (confirm) =>	 {
        callback(confirm);
    });
}
