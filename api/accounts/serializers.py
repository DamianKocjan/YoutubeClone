from django_countries.serializers import CountryFieldMixin
from rest_framework import status
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import ReadOnlyField
from rest_framework.views import Response

from .models import Subscription
from .models import User


class UserSerializer(CountryFieldMixin, ModelSerializer):
    subscribers_count = ReadOnlyField(source='get_subscribers_count')

    class Meta:
        model = User
        read_only_fields = ['subscribers_count']
        exclude = ['password', 'user_permissions', 'groups', 'last_login', 'is_superuser', 'is_staff', 'is_active']


class SubscriptionUserSerializer(ModelSerializer):
    subscribers_count = ReadOnlyField(source='get_subscribers_count')

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'subscribers_count']


class SubscriptionSerializer(ModelSerializer):
    channel = SubscriptionUserSerializer(many=False, read_only=True)
    channel_id = PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['created_at']

    def create(self, validated_data):
        if validated_data['channel_id'] == validated_data['user']:
            return Response(status=status.HTTP_409_CONFLICT)

        subscription, created = Subscription.objects.get_or_create(channel=validated_data['channel_id'], user=validated_data['user'])
        return subscription
