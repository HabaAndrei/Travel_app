import {ADDRESS_FUNCTION_FUZZY, ADDRESS_FUNCTION_AI_GENERATION, ADDRESS_FUNCTION_SEND_CODE_VERIFICATION, SERVER_ADDRESS_IMAGES,
    MEASUREMENT_ID, APIKEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID
} from '@env';

/** getter with singleton */
class EnvConfig {
    static getInstance(){
        if (!this.instance){
            this.instance = new EnvConfig();
            this.instance.config = {
                address_function_fuzzy: ADDRESS_FUNCTION_FUZZY,
                address_function_ai_generation: ADDRESS_FUNCTION_AI_GENERATION,
                address_function_send_code_verification: ADDRESS_FUNCTION_SEND_CODE_VERIFICATION,
                server_address_images: SERVER_ADDRESS_IMAGES,
                measurement_id: MEASUREMENT_ID,
                apiKey: APIKEY,
                auth_domain: AUTH_DOMAIN,
                project_id: PROJECT_ID,
                storage_bucket: STORAGE_BUCKET,
                messaging_sender_id: MESSAGING_SENDER_ID,
                app_id: APP_ID
            };
        }
        return this.instance;
    }

    get(key){
        return this.config[key];
    }

}

export {EnvConfig};