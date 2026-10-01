import os
from celery import Celery

# Set the default Django settings module for Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# Create the Celery application instance
app = Celery('autobidder')

# Load configuration from Django settings
# All Celery settings should be prefixed with CELERY_ in settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all installed Django apps
# Celery looks for a tasks.py file in each app directory
app.autodiscover_tasks()