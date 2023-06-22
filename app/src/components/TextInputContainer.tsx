import React from "react";
import { View, TextInput, TextStyle, ViewStyle } from "react-native";

interface TextInputContainerProps {
  placeholder: string;
  value: string | any;
  setValue: (text: string) => void;
  keyboardType?: any;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const TextInputContainer: React.FC<TextInputContainerProps> = ({
  placeholder,
  value,
  setValue,
  keyboardType,
  containerStyle,
  inputStyle,
}) => {
  return (
    <View
      style={{
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#202427",
        borderRadius: 12,
        marginVertical: 12,
        ...containerStyle,
      }}
    >
      <TextInput
        style={{
          margin: 8,
          padding: 8,
          width: "90%",
          textAlign: "center",
          fontSize: 16,
          color: "#FFFFFF",
          ...inputStyle,
        }}
        multiline={true}
        numberOfLines={1}
        cursorColor={"#5568FE"}
        placeholder={placeholder}
        placeholderTextColor={"#9A9FA5"}
        onChangeText={setValue}
        value={value}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default TextInputContainer;
