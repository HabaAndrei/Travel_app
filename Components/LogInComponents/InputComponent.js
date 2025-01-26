import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Icon, EyeIcon, EyeOffIcon } from '@gluestack-ui/themed';

const InputComponent = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>{props.name}</Text>
          {props?.showEyeIcon && (
            <TouchableOpacity onPress={()=>props?.onEyePress()} style={styles.iconWrapper}>
              <Icon
                as={props?.secureTextEntry ? EyeIcon : EyeOffIcon}
                color="rgba(255, 255, 255, 0.7)"
                size="sm"
              />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={props.value}
          onChangeText={(text) => props.onChange(text)}
          secureTextEntry={props?.secureTextEntry}
        />
        {props.description && (
          <Text style={styles.description}>{props.description}</Text>
        )}
      </View>
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  input: {
    height: 45,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
});
