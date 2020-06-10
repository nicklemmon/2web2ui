import React from 'react';
import { ChevronRight } from '@sparkpost/matchbox-icons';
import { Box, Stack, Text } from 'src/components/matchbox';
import { ButtonLink } from 'src/components/links';
import { ActivityWrapper, Content } from './ActivityStyles';

function Activity({ children }) {
  return (
    <ActivityWrapper role="list">
      <Stack space="600">{children}</Stack>
    </ActivityWrapper>
  );
}

function Avatar({ children }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="gray.200"
      color="gray.800"
      borderRadius="circle"
      size="600"
    >
      {children}
    </Box>
  );
}

function Item(props) {
  const { children } = props;

  return <Box role="listitem">{children}</Box>;
}

function ViewMore(props) {
  const { onClick } = props;

  return (
    <ButtonLink style={{ textDecoration: 'none' }} onClick={onClick} ml="200" textDecoration="none">
      <span>View More</span>
      <ChevronRight size={18} />
    </ButtonLink>
  );
}

function EventDate({ children }) {
  return (
    <Box>
      <Text color="gray.700" textAlign="right">
        {children}
      </Text>
    </Box>
  );
}

Item.displayName = 'Activity.Item';
Activity.Item = Item;
Avatar.displayName = 'Activity.Avatar';
Activity.Avatar = Avatar;
ViewMore.displayName = 'Activity.ViewMore';
Activity.ViewMore = ViewMore;
EventDate.displayName = 'Activity.EventDate';
Activity.EventDate = EventDate;
Content.displayName = 'Content';
Activity.Content = Content;

export default Activity;