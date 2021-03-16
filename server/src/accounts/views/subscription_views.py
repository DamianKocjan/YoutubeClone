from django.shortcuts import get_object_or_404
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

from accounts.models import Subscription
from accounts.serializers import SubscriptionSerializer
from api.permissions import IsUserOrReadOnly


class SubscriptionViews(CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet):
    queryset = Subscription.objects.all()
    permission_classes = [IsUserOrReadOnly]
    serializer_class = SubscriptionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        user = self.request.query_params.get('user')

        if user:
            self.queryset = self.queryset.filter(user=user)

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
