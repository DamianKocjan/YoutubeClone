from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from api.permissions import IsUserOrReadOnly
from .models import CommentRating
from .models import ReplyCommentRating
from .models import VideoRating
from .serializers import CommentRatingSerializer
from .serializers import ReplyCommentRatingSerializer
from .serializers import VideoRatingSerializer


class VideoRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsUserOrReadOnly]
    serializer_class = VideoRatingSerializer
    queryset = VideoRating.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.query_params.get('user')

        if user:
            self.queryset = self.queryset.filter(user=user)

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class CommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsUserOrReadOnly]
    serializer_class = CommentRatingSerializer
    queryset = CommentRating.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.query_params.get('user')

        if user:
            self.queryset = self.queryset.filter(user=user)

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReplyCommentRatingViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsUserOrReadOnly]
    serializer_class = ReplyCommentRatingSerializer
    queryset = ReplyCommentRating.objects.all()

    def list(self, request, *args, **kwargs):
        user = self.request.query_params.get('user')

        if user:
            self.queryset = self.queryset.filter(user=user)

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
