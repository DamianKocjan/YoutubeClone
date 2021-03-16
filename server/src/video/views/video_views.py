from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.permissions import IsAuthorOrReadOnly
from video.models import Video, VideoView
from video.serializers import VideoSerializer


class VideoViews(ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly|IsAuthenticatedOrReadOnly]
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()

    #     # VideoView.objects.create(user=request.user, video=instance).save()
    #     serializer = self.get_serializer(instance)

    #     return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        exclude_video = self.request.query_params.get('exclude')
        search_query = self.request.query_params.get('search_query')
        author = self.request.query_params.get('author')

        if exclude_video:
            self.queryset = self.queryset.exclude(id=exclude_video)

        if search_query:
            self.queryset = self.queryset.filter(title__icontains=search_query)

        if author:
            self.queryset = self.queryset.filter(author=author)

        return super(VideoViews, self).list(request, *args, **kwargs)
