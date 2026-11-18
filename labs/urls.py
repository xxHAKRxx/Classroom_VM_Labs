from django.urls import path

from . import api_views, views

urlpatterns = [
    path("", views.WorkspaceView.as_view(), name="workspace"),
    path("login/", views.ProxmoxLoginView.as_view(), name="login"),
    path("logout/", views.ProxmoxLogoutView.as_view(), name="logout"),
    path("proxmox/refresh/", views.RefreshTicketView.as_view(), name="refresh_ticket"),
    path("api/labs/", api_views.LabListAPIView.as_view(), name="api_lab_list"),
    path("api/labs/<int:pk>/", api_views.LabDetailAPIView.as_view(), name="api_lab_detail"),
]