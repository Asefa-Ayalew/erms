"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from '@mantine/core';
import { useState } from 'react';
import classes from './Signin.module.css';
import { userInfo } from '../hooks/user-info';

export function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading } = userInfo();

  const parseLoginError = (error: unknown) => {
    if (!error || typeof error !== 'object') {
      return 'Login failed. Please try again.';
    }

    if ('data' in error && error.data) {
      const data = (error as { data: unknown }).data;
      if (typeof data === 'string') {
        return data;
      }
      if (typeof data === 'object' && data !== null && 'error' in data) {
        const errorField = (data as { error: unknown }).error;
        return typeof errorField === 'string' ? errorField : 'Login failed. Please try again.';
      }
    }

    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }

    return 'Login failed. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
    } catch (error) {
      setErrorMessage(parseLoginError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Text className={classes.subtitle}>
        Do not have an account yet? <Anchor>Create account</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Enter your username"
            required
            radius="md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          {errorMessage ? (
            <Alert title="Login failed" color="red" mt="md">
              {errorMessage}
            </Alert>
          ) : null}
          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            loading={isSubmitting || isLoading}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
