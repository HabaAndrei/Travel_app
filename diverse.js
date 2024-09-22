import {ADDRESS_FUNCTION_API, ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_CHECKBOX} from '@env';




const address_function_api = ADDRESS_FUNCTION_API
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;
const address_function_checkbox = ADDRESS_FUNCTION_CHECKBOX;



function formatDateFromMilliseconds(milliseconds) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`;
}


export {formatDateFromMilliseconds,  address_function_api, address_function_fuzzy, address_function_checkbox }
