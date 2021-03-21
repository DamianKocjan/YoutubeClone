from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import LogoutAndBlacklistRefreshTokenForUserView
from .views import SignUpView
from comments.views import CommentViews
from comments.views import ReplyCommentViews
from rating.views import CommentRatingViews
from rating.views import ReplyCommentRatingViews
from rating.views import VideoRatingViews
from accounts.views.subscription_views import SubscriptionViews
from accounts.views.user_views import UserViews
from video.views.library_views import LibraryViews
from video.views.playlist_views import PlaylistViews
from video.views.playlist_views import PlaylistVideoViews
from video.views.video_views import VideoViews

router = DefaultRouter()

routes = [
    {'url': r'comments', 'view': CommentViews},
    {'url': r'reply-comments', 'view': ReplyCommentViews},
    {'url': r'videos', 'view': VideoViews},
    {'url': r'libraries', 'view': LibraryViews},
    {'url': r'subscriptions', 'view': SubscriptionViews},
    {'url': r'users', 'view': UserViews},
    {'url': r'comment-rating', 'view': CommentRatingViews},
    {'url': r'reply-comment-rating', 'view': ReplyCommentRatingViews},
    {'url': r'video-rating', 'view': VideoRatingViews},
    {'url': r'playlists', 'view': PlaylistViews},
    {'url': r'playlists-video', 'view': PlaylistVideoViews},
]

for route in routes:
    router.register(route['url'], route['view'])

urlpatterns = [
    path('token/blacklist/',
         LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('', include(router.urls)),
]
