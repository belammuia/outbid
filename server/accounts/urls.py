from django.urls import path
from .views import CustomUserRegistrationView,CustomLogoutView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    path('signup/', CustomUserRegistrationView.as_view(), name='custom-user-registration'),
    path('login/', TokenObtainPairView.as_view(), name='login-user'),
    path('token/refresh/',TokenRefreshView.as_view(), name= 'token-refresh'),
    path('logout/', CustomLogoutView.as_view(), name='logout-user'),
]