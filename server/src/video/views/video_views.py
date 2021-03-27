from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from api.permissions import IsAuthor
from video.models import Video
from video.models import VideoView
from video.serializers import VideoSerializer


class VideoViews(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthor]
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    filter_fields = ('author',)
    search_fields = ('title',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_anonymous:
            view = VideoView.objects.create(user=request.user, video=self.get_object())
            view.save()
        else:
            view = VideoView.objects.create(video=self.get_object())
            view.save()

        return super(VideoViews, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        exclude_video = self.request.query_params.get('exclude')

        if exclude_video:
            self.queryset = self.queryset.exclude(id=exclude_video)

        return super(VideoViews, self).list(request, *args, **kwargs)
