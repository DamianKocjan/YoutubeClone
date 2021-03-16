from rest_framework import mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet

from api.permissions import IsUserOrReadOnly
from video.models import Library
from video.serializers import LibrarySerializer


class LibraryViews(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    queryset = Library.objects.all()
    permission_classes = [IsUserOrReadOnly&IsAuthenticatedOrReadOnly]
    serializer_class = LibrarySerializer
