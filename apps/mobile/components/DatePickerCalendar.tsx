import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';

const DatePickerCalendar = ({ 
  isVisible, 
  selectedDate, 
  onDateSelect, 
  onCancel, 
  onSave 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(selectedDate?.month || 'Dec');
  const [selectedDay, setSelectedDay] = useState(selectedDate?.day || '09');
  const [selectedYear, setSelectedYear] = useState(selectedDate?.year || '2015');

  // Full arrays for scrolling
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );
  
  const years = Array.from({ length: 100 }, (_, i) => 
    String(2024 - i)
  );

  // Scroll refs
  const monthScrollRef = useRef(null);
  const dayScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  const ITEM_HEIGHT = 40;

  // Scroll to selected item when component mounts or when visibility changes
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        scrollToSelected();
      }, 100);
    }
  }, [isVisible]);

  const scrollToSelected = () => {
    const monthIndex = months.indexOf(selectedMonth);
    const dayIndex = days.indexOf(selectedDay);
    const yearIndex = years.indexOf(selectedYear);

    if (monthScrollRef.current && monthIndex >= 0) {
      monthScrollRef.current.scrollTo({
        y: (monthIndex + 2) * ITEM_HEIGHT, // Add 2 for padding items
        animated: true
      });
    }

    if (dayScrollRef.current && dayIndex >= 0) {
      dayScrollRef.current.scrollTo({
        y: (dayIndex + 2) * ITEM_HEIGHT, // Add 2 for padding items
        animated: true
      });
    }

    if (yearScrollRef.current && yearIndex >= 0) {
      yearScrollRef.current.scrollTo({
        y: (yearIndex + 2) * ITEM_HEIGHT, // Add 2 for padding items
        animated: true
      });
    }
  };

  const handleMonthScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round((y + ITEM_HEIGHT) / ITEM_HEIGHT) - 2; // Adjust for padding
    if (index >= 0 && index < months.length) {
      setSelectedMonth(months[index]);
    }
  };

  const handleDayScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round((y + ITEM_HEIGHT) / ITEM_HEIGHT) - 2; // Adjust for padding
    if (index >= 0 && index < days.length) {
      setSelectedDay(days[index]);
    }
  };

  const handleYearScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round((y + ITEM_HEIGHT) / ITEM_HEIGHT) - 2; // Adjust for padding
    if (index >= 0 && index < years.length) {
      setSelectedYear(years[index]);
    }
  };

  const renderPickerColumn = (data, selectedValue, onScroll, scrollRef) => {
    return (
      <View style={styles.columnContainer}>
        {/* Selection indicator overlay */}
        <View style={styles.selectionIndicator} />
        
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          onScrollEndDrag={onScroll}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          bounces={false}
          scrollEventThrottle={16}
        >
          {/* Add padding items at top */}
          <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]} />
          <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]} />
          
          {data.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <TouchableOpacity
                key={`${item}-${index}`}
                style={[styles.pickerItem, { height: ITEM_HEIGHT }]}
                onPress={() => {
                  // Scroll to this item when pressed
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      y: (index + 2) * ITEM_HEIGHT,
                      animated: true
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pickerText,
                    isSelected && styles.selectedPickerText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          {/* Add padding items at bottom */}
          <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]} />
          <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]} />
        </ScrollView>
      </View>
    );
  };

  const handleSave = () => {
    onDateSelect({
      month: selectedMonth,
      day: selectedDay,
      year: selectedYear
    });
    onSave();
  };

  if (!isVisible) return null;

  return (
    <View 
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={() => {}}
      onResponderMove={() => {}}
      onResponderRelease={() => {}}
    >
      <View style={styles.pickerContainer}>
        {/* Month Column */}
        {renderPickerColumn(months, selectedMonth, handleMonthScroll, monthScrollRef)}
        
        {/* Day Column */}
        {renderPickerColumn(days, selectedDay, handleDayScroll, dayScrollRef)}
        
        {/* Year Column */}
        {renderPickerColumn(years, selectedYear, handleYearScroll, yearScrollRef)}
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <View style={styles.verticalSeparator} />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A', // Dark background to match your theme
    borderRadius: 16,
    marginTop: 8,
    paddingTop: 16,
  },
  pickerContainer: {
    height: 200,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  columnContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  pickerText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedPickerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 40,
    marginTop: -20,
    backgroundColor: 'rgba(136, 136, 136, 0.2)', // Light gray with transparency
    borderRadius: 8,
    zIndex: 1,
    pointerEvents: 'none', // Important: allows touches to pass through
  },
  separator: {
    height: 0.5,
    backgroundColor: '#888888',
    marginHorizontal: 16,
  },
  actionContainer: {
    height: 56,
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#888888',
  },
  verticalSeparator: {
    width: 0.5,
    backgroundColor: '#888888',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  saveButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  cancelText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '500',
    color: '#888888',
    lineHeight: 24,
  },
  saveText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '500',
    color: '#FF6B9D', // Adjust this color to match your theme
    lineHeight: 24,
  },
});

export default DatePickerCalendar;