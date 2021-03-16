from django.contrib import admin

from .models import (
    VideoRating,
    CommentRating,
    ReplyCommentRating,
)

admin.site.register(VideoRating)
admin.site.register(CommentRating)
admin.site.register(ReplyCommentRating)
