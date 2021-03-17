from django.contrib import admin

from .models import VideoRating
from .models import CommentRating
from .models import ReplyCommentRating

admin.site.register(VideoRating)
admin.site.register(CommentRating)
admin.site.register(ReplyCommentRating)
