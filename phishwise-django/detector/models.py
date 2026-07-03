from django.db import models


class ScanHistory(models.Model):
	url = models.TextField()
	score = models.IntegerField()
	status = models.CharField(max_length=20)
	ai_risk_score = models.IntegerField()
	ssl_title = models.TextField()
	ssl_sub = models.TextField()
	domain_age = models.TextField()
	domain_sub = models.TextField()
	is_blacklisted = models.BooleanField(default=False)
	google_safe = models.BooleanField(default=True)
	location = models.TextField()
	has_redirection = models.BooleanField(default=False)
	timestamp = models.DateTimeField()

	def __str__(self):
		return f"{self.url} ({self.status})"
