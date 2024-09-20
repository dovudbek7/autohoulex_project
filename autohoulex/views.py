from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, redirect
from .models import Post, Model, Photos, Year, Make
from .forms import OrdersForm, CommentForm, ContactForm
from .utils import handle_post_request, send_telegram_message, create_order_message, create_contact_message, \
    send_contact_telegram_message

from django.http import JsonResponse
from django.contrib.syndication.views import Feed
from django.urls import reverse


@handle_post_request
def home(request):
    form = OrdersForm()
    latest_posts = Post.published.order_by('-publish')[:3]
    return render(request, 'index.html', {'form': form, 'latest_posts': latest_posts, 'show_loader': True})


@handle_post_request
def about_us(request):
    form = OrdersForm(prefix='orders')
    return render(request, 'about.html', {'form': form})


def services(request):
    form = OrdersForm(request.POST or None)
    if form.is_valid():
        order = form.save()
        message = create_order_message(order)
        send_telegram_message(message)
        return redirect('auto:success')
    return render(request, 'faqs.html', {'form': form})


def contact_us(request):
    contact_form = ContactForm(request.POST or None, prefix='contact')
    form = OrdersForm(request.POST or None)

    if form.is_valid():
        order = form.save()
        message = create_order_message(order)
        send_telegram_message(message)
        return redirect('auto:success')

    elif 'submit_contact' in request.POST and contact_form.is_valid():
        contact = contact_form.save()
        message = create_contact_message(contact)
        send_contact_telegram_message(message)
        return redirect('auto:success')

    return render(request, 'contact.html', {'contact_form': contact_form, 'form': form})


def post_detail(request, year, month, day, slug):
    post = get_object_or_404(Post, slug=slug, publish__year=year, publish__month=month, publish__day=day)
    latest_posts = Post.published.order_by('-publish')[:3]

    comment_form = CommentForm(request.POST or None)
    if comment_form.is_valid():
        comment = comment_form.save(commit=False)
        comment.post = post
        comment.save()
        return redirect('auto:post_detail', year=post.publish.year, month=post.publish.month, day=post.publish.day,
                        slug=post.slug)

    return render(request, 'post_detail.html',
                  {'post': post, 'comment_form': comment_form, 'latest_posts': latest_posts})


def post_list_view(request):
    posts = Paginator(Post.objects.all(), 6).get_page(request.GET.get('page'))
    return render(request, 'post_list.html', {'posts': posts})


def fetch_model(request):
    query = request.GET.get('query', '')
    make_id = request.GET.get('make_id', None)

    if make_id:
        models = Model.objects.filter(make_id=make_id)
    else:
        models = Model.objects.none()

    if query:
        models = models.filter(name__icontains=query)

    return JsonResponse({'suggestions': [{'id': model.id, 'name': model.name} for model in models]})


def fetch_year(request):
    query = request.GET.get('query', '')
    years = Year.objects.filter(year__icontains=query)
    return JsonResponse({'suggestions': [{'id': year.id, 'name': year.year} for year in years]})


def fetch_make(request):
    query = request.GET.get('query', '')
    all_suggestions = request.GET.get('all_suggestions', 'false') == 'true'

    if all_suggestions:
        makes = Make.objects.all()
    else:
        makes = Make.objects.filter(name__icontains=query)

    return JsonResponse({'suggestions': [{'id': make.id, 'name': make.name} for make in makes]})


def gallery(request):
    page_obj = Paginator(Photos.objects.all(), 9).get_page(request.GET.get('page'))
    return render(request, 'gallery.html', {'page_obj': page_obj})


def get_quote(request):
    form = OrdersForm(request.POST or None)
    if form.is_valid():
        order = form.save()
        message = create_order_message(order)
        send_telegram_message(message)
        return redirect('auto:success')
    return render(request, 'get_quote.html', {'form': form, 'show_quote_button': True})


def success_view(request):
    return render(request, 'success.html')


def policy(request):
    return render(request, 'policy.html')


def trigger_404(request, exception):
    return render(request, '404.html', {'show_quote_button': True}, status=404)


