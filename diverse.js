import {ADDRESS_FUNCTION_PROGRAM, ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_CHECKBOX, ADDRESS_FUNCTION_TESTTIME} from '@env';



function formatDateFromMilliseconds(milliseconds) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`;
}

const address_function_program = ADDRESS_FUNCTION_PROGRAM
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;
const address_function_checkbox = ADDRESS_FUNCTION_CHECKBOX;
const address_function_testtime = ADDRESS_FUNCTION_TESTTIME;

export {formatDateFromMilliseconds, address_function_program, address_function_fuzzy, address_function_checkbox, address_function_testtime }
