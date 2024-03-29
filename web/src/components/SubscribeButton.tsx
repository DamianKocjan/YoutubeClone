import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../auth';

import { Button } from '@material-ui/core';

import { useSubscriptions } from '../hooks';
import { api } from '../api';
import type { ISubscription } from '../types/models';

interface Props {
  channel: string;
}

const SubscribeButton: React.FC<Props> = ({ channel }) => {
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
      data.forEach((sub) => {
        if (sub.channel.id === channel)
          setSubState({ isSubscribing: true, sub: sub });
      });
    }
  }, [data]);

  const subscribeMutation = useMutation(
    async (channelId: string) =>
      await api.post('subscriptions/', {
        channel_id: channelId,
        user: user.id,
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['subscriptions_user', user.id]);
        setSubState({ isSubscribing: false, sub: null });
      },
    }
  );
  const unsubscribeMutation = useMutation(
    async (subId: string) => await api.delete(`subscriptions/${subId}/`),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['subscriptions_user', user.id]);
        setSubState({ isSubscribing: false, sub: null });
      },
    }
  );

  const handleSubscribe = async () => {
    await subscribeMutation.mutateAsync(channel);
  };

  const handleUnSubscribe = async (subId: string) => {
    await unsubscribeMutation.mutateAsync(subId);
  };

  return (
    <>
      {status === 'loading' ? (
        <Button variant="outlined">loading...</Button>
      ) : status === 'error' ? (
        <Button variant="outlined">{error?.message || error}</Button>
      ) : subState.isSubscribing ? (
        <Button
          variant="outlined"
          onClick={() => {
            handleUnSubscribe(subState?.sub?.id as string);
          }}>
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
