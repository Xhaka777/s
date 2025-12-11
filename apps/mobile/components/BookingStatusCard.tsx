import React from 'react';
import { View, Text } from 'react-native';
import { Check, CheckCircle2, Clock, XCircle } from 'lucide-react-native';

export type BookingStatus = 'confirmed' | 'waitlist' | 'cancelled' | 'success';

interface BookingStatusCardProps {
    status: BookingStatus;
    message?: string;
}

const statusConfig = {
    confirmed: {
        title: 'Booking Confirmed',
        defaultMessage: "Your reservation is confirmed. Check your email for the ticket.",
        icon: CheckCircle2,
        iconColor: '#2B7FFF',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderColor: 'rgba(74, 144, 226, 0.3)',
        titleColor: '#2B7FFF',
    },
    waitlist: {
        title: "You're on the Waitlist",
        defaultMessage: "We'll notify you if a spot becomes available.",
        icon: Clock,
        iconColor: '#FE9A00',
        backgroundColor: 'rgba(255, 184, 0, 0.1)',
        borderColor: 'rgba(255, 184, 0, 0.3)',
        titleColor: '#FE9A00',
    },
    cancelled: {
        title: 'Booking Cancelled',
        defaultMessage: "Your booking has been cancelled. Refund will be processed within 5-7 business days.",
        icon: XCircle,
        iconColor: '#FF3B30',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderColor: 'rgba(255, 59, 48, 0.3)',
        titleColor: '#FF3B30',
    },
    success: {
        title: 'Successfully Checked In',
        defaultMessage: "Welcome! Enjoy your evening. Show this to staff if needed.",
        icon: Check,
        iconColor: '#00C950',
        backgroundColor: 'rgba(0, 201, 80,0.1)',
        borderColor: 'rgba(0, 201, 80, 0.3)',
        titleColor: '#05DF72',
    }
};

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({ status, message }) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    const displayMessage = message || config.defaultMessage;

    return (
        <View
            className="rounded-2xl p-5 border mx-5 mb-6"
            style={{
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
            }}
        >
            <View className="flex-row items-start">
                {/* Icon */}
                <View className="mr-4 mt-1">
                    <IconComponent size={28} color={config.iconColor} strokeWidth={2} />
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text
                        className="text-base font-PoppinsMedium mb-2"
                        style={{ color: config.titleColor }}
                    >
                        {config.title}
                    </Text>
                    <Text className="text-gray-300 text-sm font-PoppinsRegular leading-5">
                        {displayMessage}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default BookingStatusCard;