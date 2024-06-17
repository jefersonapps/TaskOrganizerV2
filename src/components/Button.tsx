import { useTheme } from "@/app/hooks/useTheme";
import {
  StyleSheet,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  View,
} from "react-native";
import { Text } from "./Themed";

interface ButtonProps {
  title: string;
  variant?: "default" | "outline";
}

export function Button({
  variant = "default",
  ...props
}: TouchableNativeFeedbackProps & ButtonProps) {
  const theme = useTheme();

  return (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.Ripple(theme.active, false)}
    >
      <View
        style={[
          {
            backgroundColor:
              variant === "default" ? theme.primaryOff : undefined,
            ...styles.default,
          },
          props.style,
        ]}
      >
        <Text style={{ color: theme.buttonText, fontSize: 16 }}>
          {props.title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  default: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 3,
  },
});
