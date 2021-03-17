import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  AddComment,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from '@material-ui/icons';

import axiosInstance from '../../utils/axiosInstance';
import timeDifference from '../../utils/timeDifference';
import { useVideoReplyComments } from '../../hooks';
import VideoReplyComment from './VideoReplyComment';
import { IVideoReplyComment } from '../../types/videoReplyComment';
import CommentRatingButtons from '../ratingButtons/Comment';

interface Props {
  commentId: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string;
}

const VideoComment: React.FC<Props> = ({
  commentId,
  content,
  likesCount,
  dislikesCount,
  createdAt,
  authorId,
  authorUsername,
  authorAvatar,
}: Props) => {
  const queryClient = useQueryClient();
  const { status, data, error } = useVideoReplyComments(commentId);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');

  const replyCommentMutation = useMutation(
    (newReplyComment: { comment: string; content: string }) =>
      axiosInstance.post('reply-comments/', newReplyComment),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['video_reply_comments', commentId]),
    }
  );

  const handleCommentCreation = () => {
    replyCommentMutation.mutate({
      comment: commentId,
      content: replyContent.trim(),
    });

    if (replyCommentMutation.isSuccess) {
      setReplyContent('');
      setShowForm(false);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={authorAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              <Link to={`/channel/${authorId}/`}>{authorUsername}</Link>{' '}
              {timeDifference(new Date(), new Date(createdAt))}
            </Typography>
          }
          secondary={<Typography variant="inherit">{content}</Typography>}
        />
        <ListItemSecondaryAction>
          {status !== 'error' && !error && data && data.length > 0 && (
            <IconButton
              onClick={() => {
                setShowReplies(!showReplies);
                if (showReplies === false) setShowForm(false);
              }}
            >
              {showReplies ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setShowForm(true);
            }}
          >
            <AddComment />
          </IconButton>
          <CommentRatingButtons
            comment={commentId}
            likesCount={likesCount}
            dislikesCount={dislikesCount}
          />
          <IconButton>
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {showForm && (
        <ListItem style={{ marginLeft: '40px' }}>
          <ListItemAvatar>
            <></>
          </ListItemAvatar>
          <ListItemText>
            <TextField
              placeholder="Add a public comment..."
              fullWidth
              onFocus={() => {
                setShowButtons(true);
              }}
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
              }}
            />
          </ListItemText>
          {showButtons && (
            <ListItemSecondaryAction>
              <Button
                onClick={() => {
                  setShowButtons(false);
                  setReplyContent('');
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleCommentCreation}>
                Comment
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      )}
      {showReplies &&
        (status === 'loading' ? (
          <h1>loading...</h1>
        ) : status === 'error' ? (
          <h1>{error.message}</h1>
        ) : data ? (
          data.map((reply: IVideoReplyComment) => (
            <VideoReplyComment
              key={reply.id}
              replyId={reply.id}
              content={reply.content}
              likesCount={reply.likes_count}
              dislikesCount={reply.dislikes_count}
              createdAt={reply.created_at}
              authorId={reply.author.id}
              authorUsername={reply.author.username}
              authorAvatar={reply.author.avatar}
            />
          ))
        ) : null)}
    </>
  );
};

export default VideoComment;
