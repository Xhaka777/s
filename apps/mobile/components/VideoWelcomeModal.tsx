import { Pause, Play, PlayCircle, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

interface VideoWelcomeModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function VideoWelcomeModal({
  visible,
  onClose,
  onContinue,
}: VideoWelcomeModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
    
    // Hide controls after 3 seconds when playing
    if (!isPlaying) {
      setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleVideoPress = () => {
    if (isPlaying) {
      setShowControls(!showControls);
      if (!showControls) {
        setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* <BlurView intensity={20} style={styles.blurContainer}> */}
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonCircle}>
                <X size={24} color="#000" strokeWidth={2} />
              </View>
            </TouchableOpacity>

            {/* Video Section */}
            <View style={styles.videoSection}>
              <TouchableOpacity 
                style={styles.videoContainer} 
                onPress={handleVideoPress}
                activeOpacity={1}
              >
                <Video
                  source={ { uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }}
                  style={styles.video}
                  shouldPlay={isPlaying}
                  isLooping={true}
                  resizeMode="cover"
                  useNativeControls={false}
                />
                
                {/* Play/Pause Button Overlay */}
                {showControls && (
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={32} color="#fff" fill="#fff" />
                    ) : (
                      <PlayCircle size={32} color="#fff" fill="#fff" />
                    )}
                  </TouchableOpacity>
                )}

              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.contentSection}>
              <Text style={styles.title}>Welcome Message</Text>
              <Text style={styles.description}>
                Lipsum generator: Lorem Ipsum - All the facts{'\n'}
                Lipsum generator: Lorem Ipsum - All the facts
              </Text>
              <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        {/* </BlurView> */}
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
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 500,
    height: height * 0.75,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSection: {
    height: '50%',
    backgroundColor: '#2a2a2a',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 69, 139, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentSection: {
    height: '50%',
    padding: 32,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#E91E63',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shieldIcon: {
    marginRight: 10,
  },
  shieldText: {
    fontSize: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  nextText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
});
