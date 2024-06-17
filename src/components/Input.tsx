import { useTheme } from "@/app/hooks/useTheme";
import { View } from "react-native";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";

interface ValidateProps {
  validation: () => boolean;
  helperText: string;
}

interface InputProps {
  validate?: ValidateProps;
}

export function Input(props: TextInputProps & InputProps) {
  const theme = useTheme();
  return (
    <View>
      <TextInput
        {...props}
        outlineStyle={{ borderRadius: 16 }}
        contentStyle={{ paddingHorizontal: 12, maxHeight: 200 }}
        outlineColor={
          props.validate && !props.validate.validation()
            ? theme.error
            : undefined
        }
        activeOutlineColor={
          props.validate && !props.validate.validation()
            ? theme.error
            : undefined
        }
      />
      {props.validate && (
        <HelperText
          type="error"
          visible={!props.validate.validation()}
          theme={{
            colors: {
              error: theme.error,
            },
          }}
        >
          {props.validate.helperText}
        </HelperText>
      )}
    </View>
  );
}
