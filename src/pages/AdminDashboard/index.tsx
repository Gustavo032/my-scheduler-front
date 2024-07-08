import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import AvailabilityForm from '../../components/AvailabilityForm';
import BookingList from '../../components/BookingList';
import api from '../../api';

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const toast = useToast();

  const fetchBookings = async () => {
    try {
			const token = document.cookie.split('; ')
			.find(row => row.startsWith('refreshToken='))
			?.split('=')[1];
      const response = await api.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      setBookings(response.data.books);
    } catch (error) {
      toast({ title: 'Failed to fetch bookings', status: 'error', duration: 3000 });
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await api.get('/api/availabilities', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setAvailabilities(response.data);
    } catch (error) {
      toast({ title: 'Failed to fetch availabilities', status: 'error', duration: 3000 });
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAvailabilities();
  }, []);

  return (
    <Box p={4}>
      <Heading mb={6}>Admin Dashboard</Heading>
      <VStack spacing={4}>
        <AvailabilityForm onAvailabilityChange={fetchAvailabilities} />
        <BookingList bookings={bookings} />
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
