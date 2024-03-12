import { ToastAndroid } from "react-native";

const showToast = (errorMessage: string, duration: number) => {
    ToastAndroid.showWithGravityAndOffset(
      errorMessage,
      duration,
      ToastAndroid.BOTTOM,
      0,
      100,
    );
};

export default showToast;