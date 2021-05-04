from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import GenericViewSet

from accounts.models import Subscription
from accounts.serializers import SubscriptionSerializer
from api.permissions import IsUser


class SubscriptionViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    queryset = Subscription.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsUser]
    serializer_class = SubscriptionSerializer
    filter_fields = ('user',)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
