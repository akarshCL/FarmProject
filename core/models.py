from django.db import models
from django.contrib.auth.models import User

class Farm(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    total_area = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Plot(models.Model):
    SOIL_TYPES = [
        ('clay', 'Clay'),
        ('sandy', 'Sandy'),
        ('loamy', 'Loamy'),
        ('silt', 'Silt'),
    ]

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    size = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    soil_type = models.CharField(max_length=20, choices=SOIL_TYPES)
    irrigation_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    coordinates = models.JSONField(null=True, blank=True)  # For storing GPS coordinates
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

class PlotImage(models.Model):
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='plot_images/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class PlotWorker(models.Model):
    ROLE_CHOICES = [
        ('supervisor', 'Supervisor'),
        ('worker', 'Worker'),
        ('specialist', 'Specialist'),
    ]

    plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    assigned_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

class PlantingCycle(models.Model):
    CYCLE_STATUS = [
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    crop = models.ForeignKey('Crop', on_delete=models.CASCADE)
    start_date = models.DateField()
    expected_end_date = models.DateField()
    actual_end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=CYCLE_STATUS)
    yield_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expenses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

class Employee(models.Model):
    ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('supervisor', 'Supervisor'),
        ('worker', 'Worker'),
    ]
    
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    join_date = models.DateField()
    status = models.CharField(max_length=20, default='active')

class Livestock(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    tag_number = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=50)
    breed = models.CharField(max_length=100)
    birth_date = models.DateField()
    health_status = models.CharField(max_length=20)
    last_checkup = models.DateField()
    notes = models.TextField(blank=True)

class Crop(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    field_number = models.CharField(max_length=50)
    area = models.DecimalField(max_digits=10, decimal_places=2)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    status = models.CharField(max_length=20)
    notes = models.TextField(blank=True)

class Vehicle(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    purchase_date = models.DateField()
    last_maintenance = models.DateField()
    status = models.CharField(max_length=20)
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)

class Inventory(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    reorder_level = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    reference_number = models.CharField(max_length=50, blank=True)

class Vendor(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20)

class FuelRecord(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    filled_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    odometer_reading = models.IntegerField()
    notes = models.TextField(blank=True)

class MaintenanceRecord(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    date = models.DateField()
    type = models.CharField(max_length=50)
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    performed_by = models.CharField(max_length=100)
    next_maintenance_date = models.DateField()