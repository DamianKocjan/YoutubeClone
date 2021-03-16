from rest_framework.serializers import ModelSerializer

from .models import CommentRating, ReplyCommentRating, VideoRating


class RatingBaseSerializer(ModelSerializer):
    class Meta:
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CommentRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = CommentRating


class ReplyCommentRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = ReplyCommentRating


class VideoRatingSerializer(RatingBaseSerializer):
    class Meta(RatingBaseSerializer.Meta):
        model = VideoRating
