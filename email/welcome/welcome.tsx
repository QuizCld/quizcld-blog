import * as React from 'react';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Heading>Hello, {name} 👋</Heading>
      <Text>Welcome to our platform. Glad to have you!</Text>
    </Html>
  );
}
