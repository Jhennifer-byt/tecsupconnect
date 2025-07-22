# psicopedagogia/pagination.py (o donde sea que hayas guardado tu paginador personalizado)

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPageNumberPagination(PageNumberPagination): # <--- Asegúrate que este nombre coincida
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except Exception as e:
            if "Invalid page" in str(e):
                self.page = None
                return []
            raise e

    def get_paginated_response(self, data):
        if self.page is None:
            return Response({
                'count': 0,
                'next': None,
                'previous': None,
                'results': []
            })
        
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })