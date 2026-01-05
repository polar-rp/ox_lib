import React from 'react';
import { Box, Text, rem } from '@mantine/core';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Box
      h={60}
      w={384}
      display="flex"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 'var(--mantine-radius-md)',
        borderTopRightRadius: 'var(--mantine-radius-md)',
      }}
      bg="dark.6"
    >
      <Text
        component="h1"
        size={rem(24)}
        fw={500}
        tt="uppercase"
        ta="center"
      >
        {title}
      </Text>
    </Box>
  );
};

export default React.memo(Header);