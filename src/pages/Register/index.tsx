import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';

export function Register () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleRegister = async () => {
    try {
      await axios.post('/api/register', { email, password });
      toast({ title: 'Registration successful', status: 'success', duration: 3000 });
      // Redirect to login
    } catch (error) {
      toast({ title: 'Registration failed', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto">
      <Heading mb={6}>Register</Heading>
      <VStack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleRegister}>Register</Button>
      </VStack>
    </Box>
  );
};