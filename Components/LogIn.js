import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect } from 'react'
import { Input, InputField, InputIcon, InputSlot, VStack, Button, FormControl, Heading, EyeIcon, ButtonText, 
    EyeOffIcon } from '@gluestack-ui/themed'
import {createUserEmailPassword, signInUserEmailPassword} from '../firebase.js'
import {isValidEmail} from "../diverse.js"


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

        const rez = await createUserEmailPassword(inputEmail, inputPassword.input, inputFirstName, inputSecondName);
        if(rez.type){
            const user = rez.data;
            console.log(user);
        }else{
            props.addNotification('error', "Unfortunately I could not create the account because: ");
            console.log(rez.err);

        }
    }

    async function logIn(){
        if(!inputEmail || !inputPassword.input){
            props.addNotification('warning', "Please complete all inputs");
            return;
        }

        const rez = await signInUserEmailPassword(inputEmail, inputPassword.input);
        if(rez.type){
            const user = rez.data;
        }else{
            props.addNotification('error', "Unfortunately I could not log in  the account because: ");
            console.log(rez.err);

        }
        
    }

  return (
    <View>
        {props.signInOrUp ? 
        <View>
            <FormControl  p="$4"  borderWidth="$1"  borderRadius="$lg"  borderColor="$borderLight300"  $dark-borderWidth="$1"   $dark-borderRadius="$lg"   $dark-borderColor="$borderDark800">
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
                            Password
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

                    
                    {props.signInOrUp === "signup" ?
                    <Button ml="auto" >
                        <ButtonText color="$white" onPress={createAccout} > Create</ButtonText>
                    </Button>
                    :
                    <Button ml="auto" >
                        <ButtonText color="$white" onPress={logIn} >Log in</ButtonText>
                    </Button>
                    }
                    

                </VStack>
            </FormControl>
        </View>

        :<View></View>
        }
    </View>
  )
}

export default LogIn

const styles = StyleSheet.create({})