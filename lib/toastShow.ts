import { StyleProp, TextStyle } from "react-native";
import Toast from "react-native-toast-message";

export interface ToastProps {
  text1: string;
  text2?: string;
  type?: "error" | "info" | "success";
  text1Style?: StyleProp<TextStyle>;
  text2Style?: StyleProp<TextStyle>;
}

/**
 * Display toast ensuring all content in text1 and text2 is visible, regardless of length.
 */
export const toast = ({
  text1,
  text2,
  type = "info",
  text1Style,
  text2Style,
}: ToastProps) => {
  // Adjust visibility time based on message length
  const getVisibilityTime = (t1?: string, t2?: string) => {
    const base = 4000;
    const words = ((t1 ?? "").length + (t2 ?? "").length) / 10;
    // 4000ms + 100ms per 10 chars, max 15s
    return Math.min(base + Math.floor(words) * 100, 15000);
  };

  // Use styles that ensure full text is visible (wrap + left align)
  const baseTextStyle: TextStyle = {
    flexWrap: "wrap",
    textAlign: "left",
    width: "100%",
  };

  const mergedText1Style: StyleProp<TextStyle> = [baseTextStyle, text1Style];
  const mergedText2Style: StyleProp<TextStyle> = [baseTextStyle, text2Style];

  Toast.show({
    type,
    text1,
    text2,
    props: {
      text1Style: mergedText1Style,
      text2Style: mergedText2Style,
    },
    position: "top",
    visibilityTime: getVisibilityTime(text1, text2),
    autoHide: true,
    topOffset: 50,
    bottomOffset: 40,
  });
};