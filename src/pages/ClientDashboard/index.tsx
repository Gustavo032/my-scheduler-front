import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Button, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, Input, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import BookingList from '../../components/BookingList';
import api from '../../api';
import './styles.css'; // Importe o arquivo de estilos
import BookingForm from '../../components/BookingForm/index.';

const ClientDashboard: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setBookings(response.data.bookings);
    } catch (error) {
      toast({ title: 'Failed to fetch bookings', status: 'error', duration: 3000 });
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/api/availabilities', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setAvailability(response.data.availabilities.availabilities);
    } catch (error) {
      toast({ title: 'Failed to fetch availability', status: 'error', duration: 3000 });
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAvailability();
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

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onOpen();
  };

  const handleBooking = async () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      try {
        await api.post('/api/bookings', {
          date: dateTime.toISOString(),
          service: 'corte de cabelo',
          userId: userId,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchBookings();
        toast({ title: 'Booking created successfully', status: 'success', duration: 3000 });
        onClose();
      } catch (error) {
        toast({ title: 'Failed to create booking', status: 'error', duration: 3000 });
      }
    }
  };

  const isDayAvailable = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    return availability.some((avail: { dayOfWeek: string }) => avail.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase());
  };

  const generateTimeSlots = (start: Date, end: Date) => {
    const slots = [];
    let current = new Date(start);
    while (current < end) {
      slots.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }
    return slots;
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Client Dashboard</Heading>
      <VStack spacing={4}>
        <BookingForm onBookingSuccess={fetchBookings} />
        <BookingList bookings={bookings} onCancel={handleCancelBooking} />
        <Calendar
          onClickDay={handleDayClick}
          tileClassName={({ date, view }) => {
            if (view === 'month' && isDayAvailable(date)) {
              return 'highlight';
            }
            return null;
          }}
        />
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Available Time</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter User ID" onChange={(e) => setUserId(e.target.value)} mb={4} />
            {selectedDate && availability ? (
              <>
                <Text>Available times for {selectedDate.toDateString()}:</Text>
                {availability
                  .filter((avail: { dayOfWeek: string }) => new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase() === avail.dayOfWeek.toLowerCase())
                  .map((avail: { startTime: string, endTime: string }, index: number) => {
                    const startTime = new Date(avail.startTime);
                    const endTime = new Date(avail.endTime);
                    const timeSlots = generateTimeSlots(startTime, endTime);
                    return (
                      <Box key={index} p={2} borderWidth={1} borderRadius="md" mt={2}>
                        <RadioGroup onChange={setSelectedTime}>
                          <Stack direction="column">
                            {timeSlots.map((slot, idx) => (
                              <Radio key={idx} value={slot.toLocaleTimeString()}>{slot.toLocaleTimeString()}</Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Box>
                    );
                  })}
              </>
            ) : (
              <Text>No availability data</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBooking}>
              Agendar
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClientDashboard;
