import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import React, {useState, useEffect } from 'react'
import { Input, InputField, InputIcon, InputSlot, VStack, HStack, Divider, Button, FormControl, Heading, EyeIcon, ButtonText, 
    EyeOffIcon, Card } from '@gluestack-ui/themed'
import {createUserEmailPassword,verifyEmail,  signInUserEmailPassword, forgotPassword, signOutUser, deleteTheUser} from '../firebase.js'
import {isValidEmail, isValidPassword, deleteAllFromAsyncStorage} from "../diverse.js"


const LogIn = (props) => {

    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState({ input: '', showState: false });
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputSecondName, setInputSecondName] = useState('');
    const [signInOrUp, setSignInOrUp] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState('');



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
            sendEmailVerification();
            
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


    async function sendEmailVerification(){
        console.log('s a apelat functia ca s-a trimis email')
        const rez = await verifyEmail();
        console.log(rez, '    oare s a trimis emai-ul de confimare, de ce nu apare pe pagina');
        if(rez.type){
            console.log('a intrat aici in if si se afiseaza notificarea')
          props.addNotification("success" , "Confirm on the email address that this account is valid");
        }else{
          console.log(rez.err)
          props.addNotification("error", "There was a problem verifying your email");
        }
    }

    async function signOut(){
        const rez = await signOutUser();
        if(rez.type){
          props.setUser(false)
        }else{
          console.log(rez.err);
          props.addNotification('error', "Unfortunately, we couldn't log you out");
          return;
        }
    }
    
    async function deleteUser(){
    
        const response = await props.areYouSureDeleting();
        if (!response) return;
    
        const rez = await deleteTheUser();
        if(rez.type){
          props.setUser(false);
          deleteAllFromAsyncStorage()
        }else{
          console.log(rez.err);
          props.addNotification('error', "Unfortunately, we could not delete the account");
          return;
        }
    }

  return (
    <ScrollView>
        {props.user ? 
        <View>
            

            <Button  onPress={()=>{
                console.log('se face reload la user');
                props.setRefreshUser((prev)=>{return !prev});
            }}>
                <ButtonText>
                    Refresh
                </ButtonText>
            </Button>
            
            <VStack space="2xl">  
                <HStack  px="$3"  h="$8"  rounded="$sm"  borderWidth="$2"  borderColor="$backgroundLight300"  alignItems="center"  justifyContent="center"   $dark-borderColor="$backgroundDark700"  >
                    <Button onPress={()=>signOut()} variant="link" size="xl">
                    <ButtonText>Log out</ButtonText>
                    </Button>
                    <Divider orientation="vertical" h="50%" mx="$2.5" style={{margin: 20}} />
                    <Button  onPress={()=>deleteUser()} variant="link" size="xl">
                    <ButtonText>Delete accout</ButtonText>
                    </Button>          
                </HStack>
            </VStack>
        
        </View>
        :
        <View >
            {signInOrUp ? 
            <View  style={{marginBottom: 50, margin: 20}} >
                <Card p="$5" borderRadius="$lg"  m="$3" style={styles.shadow}>

                    {isForgotPassword ? 
                
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
                            {signInOrUp === "signup" ? "Create accout" :  "Log in"  }
                        </Heading>

                        {signInOrUp === "signup" ? 
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

                        {signInOrUp === "signup" ? 
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
                                {signInOrUp === "signup" ? "The password must have at least seven characters, two of which must be numbers" : ""}
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

                        
                        <Pressable onPress={()=>setIsForgotPassword(true)}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                                Forgot your password? Click here
                            </Text>
                        </Pressable>

                        <Button ml="auto">
                            <ButtonText color="$white" onPress={signInOrUp === "signup" ? createAccout : logIn}>
                                {signInOrUp === "signup" ? "Create" : "Log in"}
                            </ButtonText>
                        </Button>
                        

                    </VStack>
                    }
                </Card>
            </View>

            :<View></View>
            }

            <View style={{ alignItems: 'center' }}>
                <VStack space="2xl">  
                <HStack  px="$3"  h="$8"  rounded="$sm"  borderWidth="$2"  borderColor="$backgroundLight300"  alignItems="center"  justifyContent="center"   $dark-borderColor="$backgroundDark700"  >
                    <Button onPress={()=>{setSignInOrUp("signup"); setIsForgotPassword(false);}} variant="link" size="xl">
                    <ButtonText>Create accout</ButtonText>
                    </Button>
                    <Divider orientation="vertical" h="50%" mx="$2.5" style={{margin: 20}} />
                    <Button  onPress={()=>{setSignInOrUp("signin"); setIsForgotPassword(false)}} variant="link" size="xl">
                    <ButtonText>Log in</ButtonText>
                    </Button>          
                </HStack>
                </VStack> 
            </View>
        </View>
    
        }
    </ScrollView>
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