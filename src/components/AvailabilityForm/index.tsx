import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, useToast } from '@chakra-ui/react';
import api from '../../api';

interface AvailabilityFormProps {
  onAvailabilityChange: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onAvailabilityChange }) => {
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const toast = useToast();

  const handleSetAvailability = async () => {
    try {
      await api.post('/api/availabilities/default', {
        dayOfWeek,
        startTime,
        endTime
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast({ title: 'Availability set successfully', status: 'success', duration: 3000 });
      onAvailabilityChange();
    } catch (error) {
      toast({ title: 'Failed to set availability', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <FormControl id="dayOfWeek">
          <FormLabel>Day of the Week</FormLabel>
          <Select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </Select>
        </FormControl>
        <FormControl id="startTime">
          <FormLabel>Start Time</FormLabel>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </FormControl>
        <FormControl id="endTime">
          <FormLabel>End Time</FormLabel>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleSetAvailability}>Set Availability</Button>
      </VStack>
    </Box>
  );
};

export default AvailabilityForm;
