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
import { useAuth } from '../hooks/useAuth';
import classes from './Signin.module.css';

export function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      // Error is handled in the provider
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
            label="Email"
            placeholder="you@mantine.dev"
            required
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button fullWidth mt="xl" radius="md" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}