from rest_framework.viewsets import ModelViewSet

from api.permissions import IsAuthorOrReadOnly
from .models import Comment, ReplyComment
from .serializers import CommentSerializer, ReplyCommentSerializer


class CommentViews(ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_fields = ('video',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ReplyCommentViews(ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly]
    serializer_class = ReplyCommentSerializer
    queryset = ReplyComment.objects.all()
    filter_fields = ('comment',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
