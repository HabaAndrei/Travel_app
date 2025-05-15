/** getter with singleton */
class EnvConfig {
    static getInstance(){
        if (!this.instance){
            this.instance = new EnvConfig();
            this.instance.config = {
                authorization_custom_token: process.env.EXPO_PUBLIC_AUTHORIZATION_CUSTOM_TOKEN,
                server_address_images: process.env.EXPO_PUBLIC_SERVER_ADDRESS_IMAGES,
                address_function_fuzzy: process.env.EXPO_PUBLIC_ADDRESS_FUNCTION_FUZZY,
                address_function_ai_generation: process.env.EXPO_PUBLIC_ADDRESS_FUNCTION_AI_GENERATION,
                address_function_send_code_verification: process.env.EXPO_PUBLIC_ADDRESS_FUNCTION_SEND_CODE_VERIFICATION,
                address_function_find_location: process.env.EXPO_PUBLIC_SERVER_ADDRESS_FIND_LOCATION,
                measurement_id: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
                api_key: process.env.EXPO_PUBLIC_API_KEY,
                auth_domain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
                project_id: process.env.EXPO_PUBLIC_PROJECT_ID,
                storage_bucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
                messaging_sender_id: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
                app_id: process.env.EXPO_PUBLIC_APP_ID
            };
        }
        return this.instance;
    }

    get(key){
        return this.config[key];
    }

}

export {EnvConfig};