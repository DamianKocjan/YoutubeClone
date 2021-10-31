from django.conf import settings
from django.db import models

from rating.models import CommentRating
from rating.models import ReplyCommentRating


class CommentBase(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_author')
    content = models.CharField(max_length=500)
    is_edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Comment(CommentBase):
    video = models.ForeignKey(
        'video.Video', on_delete=models.CASCADE, related_name='comment_video')

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['created_at']

    def __str__(self) -> str:
        return f'Comment - {self.id}'

    @property
    def get_likes_count(self) -> int:
        return CommentRating.objects.filter(comment=self.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return CommentRating.objects.filter(comment=self.id, is_liking=False).count()


class ReplyComment(CommentBase):
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='replycomment_comment')

    class Meta:
        verbose_name = 'Reply Comment'
        verbose_name_plural = 'Reply Comments'
        ordering = ['created_at']

    def __str__(self) -> str:
        return f'Reply Comment - {self.id}'

    @property
    def get_likes_count(self) -> int:
        return ReplyCommentRating.objects.filter(reply_comment=self.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return ReplyCommentRating.objects.filter(reply_comment=self.id, is_liking=False).count()
