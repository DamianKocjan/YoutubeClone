from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ReadOnlyField

from accounts.serializers import UserSerializer
from .models import Comment
from .models import ReplyComment


class CommentSerializer(ModelSerializer):
    author         = UserSerializer(many=False, read_only=True)
    likes_count    = ReadOnlyField(source='get_likes_count')
    dislikes_count = ReadOnlyField(source='get_dislikes_count')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ReplyCommentSerializer(ModelSerializer):
    author         = UserSerializer(many=False, read_only=True)
    likes_count    = ReadOnlyField(source='get_likes_count')
    dislikes_count = ReadOnlyField(source='get_dislikes_count')

    class Meta:
        model = ReplyComment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
