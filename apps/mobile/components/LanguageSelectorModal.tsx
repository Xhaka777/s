import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Check } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelectorModal({
  visible,
  onClose,
}: LanguageSelectorModalProps) {
  const { t } = useTranslation();
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      onClose();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderLanguageItem = ({ item }: { item: typeof availableLanguages[0] }) => {
    const isSelected = currentLanguage === item.code;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(item.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flagEmoji}>{item.flag}</Text>
          <Text style={[styles.languageName, isSelected && styles.selectedLanguageName]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Check size={20} color="#B8457B" strokeWidth={2} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />
      
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('language.selectLanguage')}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={24} color="#1A1A1A" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Language List */}
          <FlatList
            data={availableLanguages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxHeight: height * 0.6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  languageList: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: 'transparent',
  },
  selectedLanguageItem: {
    backgroundColor: '#F8F4F7',
    borderWidth: 1,
    borderColor: '#B8457B',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  selectedLanguageName: {
    color: '#B8457B',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 12,
  },
});