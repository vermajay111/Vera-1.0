from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class FriendsPagination(PageNumberPagination):
    page_size = 10                # default items per page
    page_size_query_param = 'page_size'  # allow client to override
    max_page_size = 50
