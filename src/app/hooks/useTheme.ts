import Colors from '@/constants/Colors';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useUserContext } from '../contexts/userContext';

export const useTheme = () => {
  const { userTheme } = useUserContext()
  const colorScheme = useColorScheme()

  const currentScheme = useMemo(() => {
    if ((userTheme === "system" || !userTheme) && colorScheme) {
      return colorScheme
    }
    if (userTheme !== "system") {
      return userTheme
    }
    return "dark"
  }, [userTheme, colorScheme])




  const theme = Colors[currentScheme];

  return {
    ...Colors,
    ...theme,
    currentScheme,
  };
};