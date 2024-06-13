import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
  root: {
    padding: 4,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    color: '#ffffff',
    backgroundColor: '#12005e',
  },
  textWhite: {
    color: '#ffffff',
  },
  textAuthenticated: {
    color: '#8bc34a',
    marginBottom: 6,
  },
  accessToken: { paddingHorizontal: 42, fontSize: 8 },
  error: {
    paddingHorizontal: 42,
    marginVertical: 8,
    color: 'red',
  },
  spacing: {
    height: 12,
  },
  loading: { margin: 15 },
  button: {
    marginVertical: 4,
    marginEnd: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: '#12005e',
  },
  textLogOut: {
    color: 'red',
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    marginBottom: 32,
    color: '#ffffff',
  },
  magicLinkBlock: {
    alignItems: 'center',
    marginVertical: 10,
    borderTopColor: 'gray',
    textAlign: 'center',
  },
  ssoBlock: {
    alignItems: 'center',
  },
  input: {
    color: '#ffffff',
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    borderColor: 'gray',
  },
  tokenViewWrapper: {
    marginHorizontal: 12,
    borderColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    width: '90%',
  },
  tokenViewTitle: { color: '#ffffff', fontSize: 15, marginBottom: 8 },
  tokenViewBody: { color: '#ffffff', fontSize: 8 },
});
