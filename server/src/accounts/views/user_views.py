from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from accounts.serializers import UserSerializer


class IsThisUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user


class UserViews(ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsThisUserOrReadOnly]
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.exclude(id=request.user.id)
        return super(UserViews, self).list(request, *args, **kwargs)
