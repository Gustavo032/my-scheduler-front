import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import BookingForm from '../../components/BookingForm/index.';
import BookingList from '../../components/BookingList';
import api from '../../api';

const ClientDashboard: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const toast = useToast();

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setBookings(response.data.books);
    } catch (error) {
      toast({ title: 'Failed to fetch bookings', status: 'error', duration: 3000 });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: number) => {
    try {
      await api.delete(`/api/bookings/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchBookings();
      toast({ title: 'Booking canceled', status: 'success', duration: 3000 });
    } catch (error) {
      toast({ title: 'Failed to cancel booking', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Client Dashboard</Heading>
      <VStack spacing={4}>
        <BookingForm onBookingSuccess={fetchBookings} />
        <BookingList bookings={bookings} onCancel={handleCancelBooking} />
      </VStack>
    </Box>
  );
};

export default ClientDashboard;
