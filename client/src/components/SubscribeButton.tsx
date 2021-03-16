import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../auth';

import { Button } from '@material-ui/core';

import { useSubscriptions } from '../hooks';
import axiosInstance from '../utils/axiosInstance';
import { ISubscription } from '../types/subscription';

interface Props {
  channel: string;
}

const SubscribeButton: React.FC<Props> = ({ channel }: Props) => {
  const { user, isLogged } = useAuthState();

  if (!isLogged || channel === user.id)
    return <Button variant="outlined">Subscribe</Button>;

  const queryClient = useQueryClient();
  const { status, data, error } = useSubscriptions(user.id);
  const [subState, setSubState] = useState<{
    isSubscribing: boolean;
    sub: ISubscription | null;
  }>({ isSubscribing: false, sub: null });

  useEffect(() => {
    if (data) {
      data.forEach((sub: ISubscription) => {
        if (sub.channel.id === channel)
          setSubState({ isSubscribing: true, sub: sub });
      });
    }
  }, [data]);

  const subscribeMutation = useMutation(
    (channelId: string) =>
      axiosInstance.post('/subscriptions/', {
        channel_id: channelId,
        user: user.id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subscriptions_user', user.id]);
        setSubState({ isSubscribing: false, sub: null });
      },
    }
  );
  const unsubscribeMutation = useMutation(
    (subId: string) => axiosInstance.delete(`/subscriptions/${subId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subscriptions_user', user.id]);
        setSubState({ isSubscribing: false, sub: null });
      },
    }
  );

  const handleSubscribe = () => {
    subscribeMutation.mutate(channel);
  };

  const handleUnSubscribe = (subId: string) => {
    unsubscribeMutation.mutate(subId);
  };

  return (
    <>
      {status === 'loading' ? (
        <Button variant="outlined">loading...</Button>
      ) : status === 'error' ? (
        <Button variant="outlined">{error.message}</Button>
      ) : subState.isSubscribing ? (
        <Button
          variant="outlined"
          onClick={() => {
            handleUnSubscribe(subState?.sub?.id as string);
          }}
        >
          Subscribed
        </Button>
      ) : (
        <Button variant="outlined" onClick={handleSubscribe}>
          Subscribe
        </Button>
      )}
    </>
  );
};

export default SubscribeButton;
