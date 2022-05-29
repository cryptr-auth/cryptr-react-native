import Toast from 'react-native-toast-message';

export const showProperToast = (data: any) => {
  const attrs = data.access_token
    ? {
        type: 'success',
        text1: 'Tokens retrieved',
        text2: `Access token: ${data.access_token}`,
      }
    : { type: 'error', text1: 'Tokens error', text2: 'somme error occured' };
  Toast.show(attrs);
};
