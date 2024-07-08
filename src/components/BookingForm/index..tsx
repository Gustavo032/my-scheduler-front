import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import api from '../../api';

interface BookingFormProps {
  onBookingSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const toast = useToast();

  const handleBooking = async () => {
    try {
      await api.post('/api/bookings', { service, date }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast({ title: 'Booking successful', status: 'success', duration: 3000 });
      onBookingSuccess();
    } catch (error) {
      toast({ title: 'Booking failed', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <FormControl id="service">
          <FormLabel>Service</FormLabel>
          <Input value={service} onChange={(e) => setService(e.target.value)} />
        </FormControl>
        <FormControl id="date">
          <FormLabel>Date</FormLabel>
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleBooking}>Book</Button>
      </VStack>
    </Box>
  );
};

export default BookingForm;
