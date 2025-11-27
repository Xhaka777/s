import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const DatePickerCalendar = ({
  isVisible,
  selectedDate,
  onDateSelect,
  onCancel,
  onSave
}) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  // Get initial values with fallbacks
  const getInitialMonthIndex = () => {
    if (selectedDate?.month) {
      const index = months.indexOf(selectedDate.month);
      return index >= 0 ? index : 11;
    }
    return 11; // December
  };

  const getInitialDay = () => {
    if (selectedDate?.day) {
      const parsed = parseInt(selectedDate.day);
      return !isNaN(parsed) ? parsed : 9;
    }
    return 9;
  };

  const getInitialYear = () => {
    if (selectedDate?.year) {
      const parsed = parseInt(selectedDate.year);
      return !isNaN(parsed) ? parsed : 2000;
    }
    return 2000;
  };

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(getInitialMonthIndex());
  const [selectedDay, setSelectedDay] = useState(getInitialDay());
  const [selectedYear, setSelectedYear] = useState(getInitialYear());

  const monthScrollRef = useRef(null);
  const dayScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  // Get days in month
  const getDaysInMonth = (monthIndex, year) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Update parent when selection changes
  useEffect(() => {
    if (onDateSelect && isVisible) {
      onDateSelect({
        month: months[selectedMonthIndex],
        day: String(selectedDay).padStart(2, '0'),
        year: String(selectedYear),
      });
    }
  }, [selectedMonthIndex, selectedDay, selectedYear, isVisible]);

  // Initialize scroll positions
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        const monthY = selectedMonthIndex * ITEM_HEIGHT;
        const dayY = (selectedDay - 1) * ITEM_HEIGHT;
        const yearIndex = years.indexOf(selectedYear);
        const yearY = yearIndex !== -1 ? yearIndex * ITEM_HEIGHT : 0;

        monthScrollRef.current?.scrollTo({ y: monthY, animated: false });
        dayScrollRef.current?.scrollTo({ y: dayY, animated: false });
        yearScrollRef.current?.scrollTo({ y: yearY, animated: false });
      }, 150);
    }
  }, [isVisible]);

  const handleScroll = (event, type) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (type === 'month') {
      const newMonth = Math.max(0, Math.min(11, index));
      setSelectedMonthIndex(newMonth);

      const daysInMonth = getDaysInMonth(newMonth, selectedYear);
      if (selectedDay > daysInMonth) {
        setSelectedDay(daysInMonth);
        dayScrollRef.current?.scrollTo({
          y: (daysInMonth - 1) * ITEM_HEIGHT,
          animated: true,
        });
      }
    } else if (type === 'day') {
      const daysInMonth = getDaysInMonth(selectedMonthIndex, selectedYear);
      const newDay = Math.max(1, Math.min(daysInMonth, index + 1));
      setSelectedDay(newDay);
    } else if (type === 'year') {
      if (index >= 0 && index < years.length) {
        const newYear = years[index];
        setSelectedYear(newYear);

        const daysInMonth = getDaysInMonth(selectedMonthIndex, newYear);
        if (selectedDay > daysInMonth) {
          setSelectedDay(daysInMonth);
          dayScrollRef.current?.scrollTo({
            y: (daysInMonth - 1) * ITEM_HEIGHT,
            animated: true,
          });
        }
      }
    }
  };

  const renderColumn = (data, selectedValue, scrollRef, type) => {
    let displayData = data;
    
    // Limit days based on current month
    if (type === 'day') {
      const daysInMonth = getDaysInMonth(selectedMonthIndex, selectedYear);
      displayData = data.slice(0, daysInMonth);
    }

    return (
      <View style={styles.column}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => handleScroll(e, type)}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >
          {displayData.map((item, index) => {
            let isSelected = false;
            let distance = 0;

            if (type === 'month') {
              isSelected = index === selectedValue;
              distance = Math.abs(index - selectedValue);
            } else if (type === 'day') {
              isSelected = index + 1 === selectedValue;
              distance = Math.abs(index + 1 - selectedValue);
            } else if (type === 'year') {
              isSelected = item === selectedValue;
              const yearIndex = years.indexOf(selectedValue);
              distance = Math.abs(index - yearIndex);
            }

            const opacity = Math.max(0.3, 1 - (distance * 0.25));

            return (
              <View key={`${type}-${index}`} style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    isSelected && styles.selectedItemText,
                    { opacity },
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Picker columns */}
      <View style={styles.pickerContainer}>
        {renderColumn(months, selectedMonthIndex, monthScrollRef, 'month')}
        {renderColumn(days, selectedDay, dayScrollRef, 'day')}
        {renderColumn(years, selectedYear, yearScrollRef, 'year')}
      </View>

      {/* Selection indicator overlay */}
      <View style={styles.selectionIndicator} pointerEvents="none" />

      {/* Gradient fades */}
      <View style={[styles.gradientOverlay, styles.topGradient]} pointerEvents="none" />
      <View style={[styles.gradientOverlay, styles.bottomGradient]} pointerEvents="none" />

      {/* Action buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: '#1a1a1a',
  },
  column: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  selectedItemText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 10,
    right: 10,
    height: ITEM_HEIGHT,
    // backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
  },
  topGradient: {
    top: 0,
    // backgroundColor: 'rgba(26, 26, 26, 0.95)',
  },
  bottomGradient: {
    bottom: 60,
    // backgroundColor: 'rgba(26, 26, 26, 0.95)',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 60,
    backgroundColor: '#1a1a1a',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#333',
  },
  cancelText: {
    color: '#999',
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  saveText: {
    color: '#99225E',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});

export default DatePickerCalendar;