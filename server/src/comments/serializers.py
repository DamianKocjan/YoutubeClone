from rest_framework.serializers import ModelSerializer

from accounts.serializers import UserSerializer
from .models import Comment
from .models import ReplyComment


class CommentSerializer(ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ReplyCommentSerializer(ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = ReplyComment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
