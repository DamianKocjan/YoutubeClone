from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from accounts.serializers import UserSerializer


class IsThisUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        elif obj.id == request.user.id:
            return True
        return False


class UserViews(ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsThisUser]
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.exclude(id=request.user.id)
        return super(UserViews, self).list(request, *args, **kwargs)
