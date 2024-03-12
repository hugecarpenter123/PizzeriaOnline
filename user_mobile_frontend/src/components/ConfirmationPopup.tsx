import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  isVisible: boolean;
  message: string;
  onYes: () => void;
  onNo: () => void;
};

const ConfirmationPopup: React.FC<Props> = ({ isVisible, message, onYes, onNo }) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onNo} style={[styles.button, styles.noButton]}>
              <Text style={styles.buttonText}>Nie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onYes} style={[styles.button, styles.yesButton]}>
              <Text style={styles.buttonText}>Tak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  yesButton: {
    backgroundColor: 'red',
  },
  noButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConfirmationPopup;
