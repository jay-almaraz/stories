import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface BottomButtonProp {
  disabled?: boolean;
  onPress: () => void;
  mode: 'text' | 'outlined' | 'contained' | undefined;
  label: string;
}
interface BottomButtonsProps {
  buttons: BottomButtonProp[];
}
export const BottomButtons: React.FC<BottomButtonsProps> = (props) => {
  const { buttons } = props;

  return (
    <View style={styles.buttonContainer}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          disabled={button.disabled}
          onPress={button.onPress}
          mode={button.mode}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {button.label}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '40%',
  },
  buttonLabel: {
    fontSize: 20,
  },
});
