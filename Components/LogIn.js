import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, {useState, useEffect } from 'react'
import { Input, InputField, InputIcon, InputSlot, VStack, Button, FormControl, Heading, EyeIcon, ButtonText, 
    EyeOffIcon, Card } from '@gluestack-ui/themed'
import {createUserEmailPassword, signInUserEmailPassword, forgotPassword} from '../firebase.js'
import {isValidEmail, isValidPassword} from "../diverse.js"


const LogIn = (props) => {

    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState({ input: '', showState: false });
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputSecondName, setInputSecondName] = useState('');



    async function createAccout(){
        if(!inputEmail || !inputPassword.input || !inputFirstName || !inputSecondName){
            props.addNotification('warning', "Please complete all inputs");
            return;
        }

        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        if(!isValidPassword(inputPassword.input)){
            props.addNotification('error', "The password must have at least seven characters, two of which must be numbers");
            return;
        }

        const rez = await createUserEmailPassword(inputEmail, inputPassword.input, inputFirstName, inputSecondName);
        if(rez.type){
            const user = rez.data;
        }else{
            if(rez.err?.message?.includes("auth/email-already-in-use")){
                props.addNotification('error',"This email address is already in use");
            }else{
                props.addNotification('error', "Unfortunately I could not create the account ");
            }
            console.log(rez.err);
        }
    }

    async function logIn(){
        if(!inputEmail || !inputPassword.input){
            props.addNotification('warning', "Please complete all inputs");
            return;
        }

        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        const rez = await signInUserEmailPassword(inputEmail, inputPassword.input);
        if(rez.type){
            const user = rez.data;
        }else{
            props.addNotification('error', "The email address or password is not visible");
            console.log(rez.err);

        }
    }

    
    async function forgotThePassword(){
        if(!isValidEmail(inputEmail)){
            props.addNotification('error', "The email address is not valid");
            return;
        }

        const rez = await forgotPassword(inputEmail);
        if(rez.type){
            props.addNotification('success', "Password reset email has been sent");
        }else{
            props.addNotification('error', "Sending the password reset email did not work");
            console.log(rez.err);
        }
    }

  return (
    <View >
        {props.signInOrUp ? 
        <View  style={{marginBottom: 50, margin: 20}} >
            <Card p="$5" borderRadius="$lg"  m="$3" style={styles.shadow}>

                {props.isForgotPassword ? 
                <VStack space="xs">
    
                    <Text color="$text500" lineHeight="$xs">
                        Write the email to which you want to reset the password
                    </Text>
                    <Input>
                        <InputField
                        type="text"
                        value={inputEmail}
                        onChangeText={(text) => setInputEmail(text)}
                        />
                    </Input>

                    <Button ml="auto" >
                        <ButtonText color="$white" onPress={forgotThePassword} >Send email</ButtonText>
                    </Button>
                </VStack>

                :    
                <VStack space="xl">
                    <Heading color="$text900" lineHeight="$md">
                        {props.signInOrUp === "signup" ? "Create accout" :  "Log in"  }
                    </Heading>

                    {props.signInOrUp === "signup" ? 
                        <VStack space="xs">
                            <Text color="$text500" lineHeight="$xs">
                            First name
                            </Text>
                            <Input>
                            <InputField
                                type="text"
                                value={inputFirstName}
                                onChangeText={(text) => setInputFirstName(text)}
                            />
                            </Input>
                        </VStack> : <View></View>
                    }  

                    {props.signInOrUp === "signup" ? 
                        <VStack space="xs">
                            <Text color="$text500" lineHeight="$xs">
                            Second name
                            </Text>
                            <Input>
                            <InputField
                                type="text"
                                value={inputSecondName}
                                onChangeText={(text) => setInputSecondName(text)}
                            />
                            </Input>
                        </VStack> : <View></View>
                    }

                    <VStack space="xs">
                        <Text color="$text500" lineHeight="$xs">
                            Email
                        </Text>
                        <Input>
                            <InputField
                            type="text"
                            value={inputEmail}
                            onChangeText={(text) => setInputEmail(text)}
                            />
                        </Input>
                    </VStack>

                    <VStack space="xs">
                        <Text color="$text500" lineHeight="$xs"> 
                            Password - 
                            {props.signInOrUp === "signup" ? "The password must have at least seven characters, two of which must be numbers" : ""}
                        </Text>
                        <Input textAlign="center">
                            <InputField
                            type={inputPassword.showState ? "text" : "password"}
                            value={inputPassword.input}
                            onChangeText={(text) => setInputPassword({ ...inputPassword, input: text })}
                            />
                            <InputSlot pr="$3" onPress={() => setInputPassword(prev => ({ ...prev, showState: !prev.showState }))}>
                            <InputIcon
                                as={inputPassword.showState ? EyeIcon : EyeOffIcon}
                                color="$darkBlue500"
                            />
                            </InputSlot>
                        </Input>
                    </VStack>

                    
                    <Pressable onPress={()=>props.setIsForgotPassword(true)}>
                        <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                            Forgot your password? Click here
                        </Text>
                    </Pressable>

                    <Button ml="auto">
                        <ButtonText color="$white" onPress={props.signInOrUp === "signup" ? createAccout : logIn}>
                            {props.signInOrUp === "signup" ? "Create" : "Log in"}
                        </ButtonText>
                    </Button>
                    

                </VStack>
                }
            </Card>
        </View>

        :<View></View>
        }
    </View>
  )
}

export default LogIn

const styles = StyleSheet.create({
    shadow:{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
})