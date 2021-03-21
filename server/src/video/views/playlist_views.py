from rest_framework import mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ModelViewSet

from api.permissions import IsAuthorOrReadOnly
from video.models import Playlist
from video.models import PlaylistVideo
from video.models import PlaylistView
from video.serializers import PlaylistSerializer
from video.serializers import PlaylistVideoSerializer


class PlaylistViews(ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly|IsAuthenticatedOrReadOnly]
    serializer_class = PlaylistSerializer
    queryset = Playlist.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_anonymous:
            view = PlaylistView.objects.create(user=request.user, playlist=self.get_object())
            view.save()

        return super(PlaylistViews, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        exclude_playlist = self.request.query_params.get('exclude')
        search_query = self.request.query_params.get('search_query')
        author = self.request.query_params.get('author')

        if exclude_playlist:
            self.queryset = self.queryset.exclude(id=exclude_playlist)

        if search_query:
            self.queryset = self.queryset.filter(title__icontains=search_query)

        if author:
            self.queryset = self.queryset.filter(author=author)

        return super(PlaylistViews, self).list(request, *args, **kwargs)


class PlaylistVideoViews(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PlaylistVideoSerializer
    queryset = PlaylistVideo.objects.all()

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
