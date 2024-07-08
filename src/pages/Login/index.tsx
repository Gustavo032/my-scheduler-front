import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import api from '../../api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Chame a API e obtenha a resposta
      const response = await api.post<{ role: string }>('/sessions', { email, password });

      // Use o toast para mostrar a promessa
      await toast.promise(
        Promise.resolve(response),
        {
          loading: { title: 'Entrando...', description: 'Por favor, aguarde...' },
          success: { title: 'Usuário logado com sucesso!', description: 'Login bem-sucedido' },
          error: { title: 'Erro ao logar usuário', description: 'Credenciais incorretas' },
        }
      );

			console.log(response)
      if (response.data && response.data.role) {
        // localStorage.setItem('userRole', response.data.role);
				if (response.data.role === 'ADMIN') {
					navigate('/admin-dashboard');
				} else {
					navigate('/client-dashboard');
				}
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      toast({
        title: 'Erro ao logar usuário',
        description: 'Credenciais incorretas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4} as="form" onSubmit={handleLogin}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                type='submit'
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
