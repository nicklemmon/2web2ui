import React from 'react';
import { Button, Modal, Text, Radio, Stack } from 'src/components/matchbox';
import { useForm } from 'react-hook-form';
import { TranslatableText } from 'src/components/text';
export function DomainAlignmentModal(props) {
  const { isOpen, onSubmit, onClose } = props;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      strictalignment: 'yes',
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="domainAlignmentForm">
      <Modal open={isOpen}>
        <Modal.Header showCLoseButton>Domain Alignment</Modal.Header>
        <Modal.Content>
          <Stack>
            <Text as="p">
              Alignment in email refers to the relationship between the sending and bounce domain
              used for outbound messages.
            </Text>
            <Text as="p">
              <Text as="span" fontWeight="semibold">
                Strict{' '}
              </Text>
              <TranslatableText>
                alignment is when sending and bounce domain are the same value (e.g. sending domain
                = sparkpost.com and bounce domain = sparkpost.com)
              </TranslatableText>
            </Text>
            <Text as="p">
              <Text as="span" fontWeight="semibold">
                Relaxed{' '}
              </Text>
              <TranslatableText>
                alignment is when bounce domain is a subdomain of the sending domain (e.g. sending
                domain = sparkpost.com while bounce domain = bounces.sparkpost.com)
              </TranslatableText>
            </Text>
            <Text as="p">
              Use of strict or relaxed alignment is considered best practice by many mailbox
              providers. Note, there is no inherent advantage to one over the other.
            </Text>
            <Radio.Group label="Verify domain for bounce for strict alignment">
              <Radio
                ref={register}
                label="Yes"
                id="yes-to-strict-alignment"
                value="yes"
                name="strictalignment"
              />
              <Radio
                ref={register}
                label="No"
                id="no-to-strict-alignment"
                value="no"
                name="strictalignment"
              />
            </Radio.Group>
          </Stack>
        </Modal.Content>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="domainAlignmentForm">
            Save and Continue
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}
