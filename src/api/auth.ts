// api/auth.ts
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation';

export const useAuth = () => {
  const [token, setToken] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  const handleContinue = () => {
    if (token.trim()) {
      navigation.navigate('Posts', {token});
    }
  };

  return {
    token,
    setToken,
    handleContinue,
  };
};
