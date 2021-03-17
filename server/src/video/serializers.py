from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import IntegerField
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import ReadOnlyField

from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Category
from .models import Library
from .models import Playlist
from .models import PlaylistVideo
from .models import PlaylistView
from .models import SubCategory
from .models import Video
from .models import VideoView


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


class VideoViewSerializer(ModelSerializer):
    class Meta:
        model = VideoView
        fields = '__all__'


class PlaylistVideo(ModelSerializer):
    class Meta:
        model = PlaylistVideo
        fields = ['playlist', 'video', 'position']


class PlaylistSerializer(ModelSerializer):
    author            = UserSerializer(many=False, read_only=True)
    author_id         = PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    videos            = PlaylistVideo(many=True, read_only=True)
    videos_id         = PrimaryKeyRelatedField(queryset=Video.objects.all(), write_only=True)
    playlist_to_video = VideoSerializer(many=True)

    class Meta:
        model = Playlist
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PlaylistViewSerializer(ModelSerializer):
    class Meta:
        model = PlaylistView
        fields = '__all__'


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
