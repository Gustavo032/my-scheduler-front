import React from 'react';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

interface Booking {
  id: number;
  service: string;
  date: string;
}

interface BookingListProps {
  bookings: Booking[];
  onCancel?: (id: number) => void;
}

const BookingList: React.FC<BookingListProps> = ({ bookings = [], onCancel }) => {
  return (
    <VStack spacing={4} w="full">
      {bookings.map((booking) => (
        <Box key={booking.id} p={4} borderWidth={1} borderRadius="lg" w="full">
          <Text>Service: {booking.service}</Text>
          <Text>Date: {new Date(booking.date).toLocaleString()}</Text>
          {onCancel && (
            <Button colorScheme="red" mt={2} onClick={() => onCancel(booking.id)}>
              Cancel
            </Button>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default BookingList;
