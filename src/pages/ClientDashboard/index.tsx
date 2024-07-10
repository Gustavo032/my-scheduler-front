import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../../api';

const ClientDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [specialAvailability, setSpecialAvailability] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchBookings();
    fetchAvailability();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      toast({ title: 'Failed to fetch bookings', status: 'error', duration: 3000 });
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/api/availabilities');
      setAvailability(response.data.defaultSchedules);
      setSpecialAvailability(response.data.specificSchedules);
    } catch (error) {
      toast({ title: 'Failed to fetch availability', status: 'error', duration: 3000 });
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onOpen();
  };

  const handleBooking = async () => {
    if (selectedDate && selectedTime && userId) {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      try {
        await api.post('/api/bookings', {
          date: dateTime.toISOString(),
          service: 'Haircut', // Substitua pelo serviço correto
          userId,
        });
        toast({ title: 'Booking created successfully', status: 'success', duration: 3000 });
        fetchBookings();
        onClose();
      } catch (error) {
        toast({ title: 'Failed to create booking', status: 'error', duration: 3000 });
      }
    }
  };

  const isDayAvailable = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Verifica se há disponibilidade padrão para o dia da semana
    const defaultAvailable = availability.some(
      (avail) => avail.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );

    // Verifica se há disponibilidade especial para a data específica
    const specialAvailable = specialAvailability.some(
      (avail) => new Date(avail.date).toDateString() === date.toDateString()
    );

    return defaultAvailable || specialAvailable;
  };

  const generateTimeSlots = (start: Date, end: Date) => {
    const slots = [];
    let current = new Date(start);
    while (current <= end) {
      slots.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }
    return slots;
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Client Dashboard</Heading>
      <VStack spacing={4}>
        <Calendar
          onClickDay={handleDayClick}
          tileClassName={({ date }) => {
            if (isDayAvailable(date)) {
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
            <Input
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              mb={4}
            />
            {selectedDate && (
              <>
                <Text>Available times for {selectedDate.toLocaleDateString()}:</Text>
                {availability
                  .filter(
                    (avail) =>
                      avail.dayOfWeek.toLowerCase() ===
                      selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                  )
                  .map((avail, index) => {
                    const startTime = new Date(avail.startTime);
                    const endTime = new Date(avail.endTime);
                    const timeSlots = generateTimeSlots(startTime, endTime);
                    return (
                      <Box key={index} p={2} borderWidth={1} borderRadius="md" mt={2}>
                        <RadioGroup value={selectedTime} onChange={setSelectedTime}>
                          <Stack direction="column">
                            {timeSlots.map((slot, idx) => (
                              <Radio key={idx} value={slot.toLocaleTimeString()}>
                                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Box>
                    );
                  })}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBooking}>
              Book
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClientDashboard;
