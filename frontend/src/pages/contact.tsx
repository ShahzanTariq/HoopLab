import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { ContactIconsList } from '../components/contact_icons';
import classes from './styles/contact.module.css';
import {useState} from 'react';


const social = [IconBrandTwitter, IconBrandYoutube, IconBrandInstagram];

export function Contact() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState(false);
  const [commentError, setCommentError] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    // Reset validation errors
    setEmailError('');
    setNameError(!name);
    setCommentError(!comment);

     // Validate email format
    if (!email) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    }

    // If any field is invalid, prevent submission
    if (!email || !emailRegex.test(email) || !name || !comment) {
      return;
    }


    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, comment }),
      });

      if (response.ok) {
        setShowSuccess(true); // Show success message
        setEmail('');
        setName('');
        setComment('');

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        alert('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const icons = social.map((Icon, index) => (
    <ActionIcon key={index} size={28} className={classes.social} variant="transparent">
      <Icon size={22} stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <div className={classes.wrapper}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
        <div>
          <Title className={classes.title}>Contact us</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            Leave your email and we will get back to you within 24 hours
          </Text>

          <ContactIconsList />

          <Group mt="xl">{icons}</Group>
        </div>
        <div className={classes.form}>
          {showSuccess && (
            <div className={classes.successMessage}>
              Message sent successfully!
            </div>
          )}
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value = {email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            error={emailError || undefined}
            classNames={{
              input: `${classes.input} ${emailError ? classes.errorInput : ''}`,
              label: classes.inputLabel,
            }}
          />
          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            required
            value = {name}
            onChange={(event) => setName(event.currentTarget.value)}
            error={nameError ? 'Name is required' : undefined}
            classNames={{
              input: `${classes.input} ${nameError ? classes.errorInput : ''}`,
              label: classes.inputLabel,
            }}
          />
          <Textarea
            required
            label="Comment"
            placeholder="Leave your comments here"
            minRows={4}
            mt="md"
            value = {comment}
            onChange={(event) => setComment(event.currentTarget.value)}
            error={commentError ? 'Comment is required' : undefined}
            classNames={{
              input: `${classes.input} ${commentError ? classes.errorInput : ''}`,
              label: classes.inputLabel,
            }}
          />

          <Group justify="flex-end" mt="md">
            <Button 
              className={classes.control}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </Group>
        </div>
      </SimpleGrid>
    </div>
  );
}

export default Contact;