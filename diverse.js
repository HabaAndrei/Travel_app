import {ADDRESS_FUNCTION_PROGRAM, ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_CHECKBOX, ADDRESS_FUNCTION_TESTTIME} from '@env';




const address_function_program = ADDRESS_FUNCTION_PROGRAM
const address_function_fuzzy = ADDRESS_FUNCTION_FUZZY;
const address_function_checkbox = ADDRESS_FUNCTION_CHECKBOX;
const address_function_testtime = ADDRESS_FUNCTION_TESTTIME;



function formatDateFromMilliseconds(milliseconds) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`;
}


async function isValidLink(link){
    try{
        let rez = false;
        let data = await   fetch(link);
        if(data.status === 200)rez = true;
        return rez;
    }catch(err){
        return false;
    }
}


async function checkWebsites(content) {
    const newProgram = {};

    try{
        for (const dayNumber of Object.keys(content.program)) {
            const day = content.program[dayNumber];
            const { activities } = day;
            const newActivities = await Promise.all(
              activities.map(async (ob) => {
                const link = ob.link;
                const rez = await isValidLink(link);
                if (rez) {
                  return ob;
                } else {
                  return { ...ob, link: '' };
                }
              })
            );
            newProgram[dayNumber] = { ...day, activities: newActivities };
        }
    }catch(err){
        console.log('Avem eroare', err);
    }
  
    return newProgram;
}

export {formatDateFromMilliseconds, checkWebsites,  address_function_program, address_function_fuzzy, address_function_checkbox, address_function_testtime }
