from django.urls import path

from . import views
from .views import *
from .sitemap import StaticViewSitemap
from django.contrib.sitemaps.views import sitemap

app_name = 'auto'

sitemaps = {
    'static': StaticViewSitemap,
}
urlpatterns = [
    path('', home, name='home'),
    path('post/<int:year>/<int:month>/<int:day>/<slug:slug>/', post_detail, name='post_detail'),
    path('post-list/', post_list_view, name='post_list'),
    path('about/', about_us, name='about'),
    path('contact/', contact_us, name='contact'),
    path('gallery/', gallery, name='gallery'),
    path('services/', services, name='services'),
    path('privecy-policy', policy, name='policy'),
    path('quote/', get_quote, name='quote'),
    path('success/', success_view, name='success'),
    path('fetch_make/', views.fetch_make, name='fetch_make'),
    path('fetch_model/', views.fetch_model, name='fetch_model'),
    path('fetch_year/', views.fetch_year, name='fetch_year'),
    path('trigger-404/', trigger_404),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]
