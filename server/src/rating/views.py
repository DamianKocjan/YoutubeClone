from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet

from api.permissions import IsUser
from .models import CommentRating
from .models import ReplyCommentRating
from .models import VideoRating
from .serializers import CommentRatingSerializer
from .serializers import ReplyCommentRatingSerializer
from .serializers import VideoRatingSerializer


class VideoRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = VideoRatingSerializer
    queryset = VideoRating.objects.all()
    filter_fields = ('user',)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class CommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = CommentRatingSerializer
    queryset = CommentRating.objects.all()
    filter_fields = ('user',)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReplyCommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = ReplyCommentRatingSerializer
    queryset = ReplyCommentRating.objects.all()
    filter_fields = ('user',)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
