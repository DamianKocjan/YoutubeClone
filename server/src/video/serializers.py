from rest_framework.serializers import IntegerField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import ReadOnlyField

from accounts.serializers import UserSerializer
from .models import Category
from .models import Library
from .models import Playlist
from .models import PlaylistVideo
from .models import SubCategory
from .models import Video


class VideoSerializer(ModelSerializer):
    author         = UserSerializer(many=False, read_only=True)
    views_count    = ReadOnlyField(source='get_views_count')
    likes_count    = ReadOnlyField(source='get_likes_count')
    dislikes_count = ReadOnlyField(source='get_dislikes_count')
    duration       = IntegerField(read_only=True)

    class Meta:
        model = Video
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PlaylistVideoSerializer(ModelSerializer):
    video = VideoSerializer(read_only=True)
    video_id = PrimaryKeyRelatedField(queryset=Video.objects.all(), write_only=True)
    playlist_id = PrimaryKeyRelatedField(queryset=Playlist.objects.all(), write_only=True)

    class Meta:
        model = PlaylistVideo
        exclude = ['playlist']

    def create(self, validated_data):
        video = validated_data['video_id']
        playlist = validated_data['playlist_id']
        position = validated_data['position']

        try:
            playlist_video = PlaylistVideo.objects.get(video=video, playlist=playlist)
            playlist_video.position = position
            playlist_video.save()
        except PlaylistVideo.DoesNotExist:
            playlist_video = PlaylistVideo.objects.create(video=video, playlist=playlist, position=position)

        playlist_videos = PlaylistVideo.objects.filter(playlist=playlist).order_by('position', 'id')

        for index, playlist_video in enumerate(playlist_videos):
            playlist_video.position = index
            playlist_video.save()

        return playlist_video


class PlaylistSerializer(ModelSerializer):
    author = UserSerializer(read_only=True)
    videos = PlaylistVideoSerializer(source='get_videos', many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class LibrarySerializer(ModelSerializer):
    playlist    = PlaylistSerializer(many=True, read_only=True)
    playlist_id = PrimaryKeyRelatedField(queryset=Playlist.objects.all(), many=True, write_only=True)

    class Meta:
        model = Library
        fields = '__all__'


class CategoryBaseSerializer(ModelSerializer):
    class Meta:
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CategorySerializer(CategoryBaseSerializer):
    class Meta(CategoryBaseSerializer.Meta):
        model = Category


class SubCategorySerializer(CategoryBaseSerializer):
    class Meta(CategoryBaseSerializer.Meta):
        model = SubCategory
