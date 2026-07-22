from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ScanHistory
from .serializers import ScanHistorySerializer, ScanRequestSerializer
from .services import scan_url_logic


@api_view(['POST'])
def scan_url(request):
    serializer = ScanRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    result = scan_url_logic(serializer.validated_data['url'])

    ScanHistory.objects.create(
        url=result['url'],
        score=result['score'],
        status=result['status'],
        ai_risk_score=result['ai_risk_score'],
        ssl_title=result['ssl_title'],
        ssl_sub=result['ssl_sub'],
        domain_age=result['domain_age'],
        domain_sub=result['domain_sub'],
        is_blacklisted=result['is_blacklisted'],
        google_safe=result['google_safe'],
        location=result['location'],
        has_redirection=result['has_redirection'],
        timestamp=timezone.now(),
    )

    request.session['last_scan_result'] = {
        'url': result['url'],
        'score': result['score'],
        'status': result['status'],
        'ai_risk_score': result['ai_risk_score'],
        'ssl_title': result['ssl_title'],
        'ssl_sub': result['ssl_sub'],
        'domain_age': result['domain_age'],
        'domain_sub': result['domain_sub'],
        'is_blacklisted': result['is_blacklisted'],
        'google_safe': result['google_safe'],
        'location': result['location'],
        'has_redirection': result['has_redirection'],
    }
    request.session.modified = True

    return Response(result)


@api_view(['GET'])
def get_scan_history(request):
    logs = ScanHistory.objects.all()
    serializer = ScanHistorySerializer(logs, many=True)
    return Response({"total_scans": logs.count(), "logs": serializer.data})
