from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from .models import Comment
from .models import ReplyComment
from .serializers import CommentSerializer
from .serializers import ReplyCommentSerializer
from api.permissions import IsAuthor


class CommentViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_fields = ('video',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReplyCommentViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = ReplyCommentSerializer
    queryset = ReplyComment.objects.all()
    filter_fields = ('comment',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
