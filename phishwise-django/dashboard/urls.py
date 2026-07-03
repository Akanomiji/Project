from django.urls import path

from . import views


urlpatterns = [
	path("", views.home, name="home"),
	path("login", views.login_view, name="login"),
	path("logout", views.logout_view, name="logout"),
	path("register", views.register_view, name="register"),
	path("forgot-password", views.forgot_password_view, name="forgot_password"),
	path("dashboard", views.dashboard_view, name="dashboard"),
	path("admin", views.admin_view, name="admin"),
	path("result", views.result_view, name="result"),
	path("report", views.report_view, name="report"),
	path("history", views.history_view, name="history"),
	path("scan-history", views.scan_history_view, name="scan_history"),
	path("knowledge", views.knowledge_view, name="knowledge"),
	path("knowledge/<int:id>", views.knowledge_detail_view, name="knowledge_detail"),
]