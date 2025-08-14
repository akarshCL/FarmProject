from django.contrib import admin
from .models import (
    Farm, Employee, Livestock, Crop, Vehicle,
    Inventory, Transaction, Vendor, FuelRecord,
    MaintenanceRecord
)

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'total_area', 'created_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('created_at',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'farm', 'role', 'status', 'join_date')
    list_filter = ('role', 'status', 'farm')
    search_fields = ('user__username', 'phone')

@admin.register(Livestock)
class LivestockAdmin(admin.ModelAdmin):
    list_display = ('tag_number', 'farm', 'type', 'breed', 'health_status')
    list_filter = ('type', 'health_status', 'farm')
    search_fields = ('tag_number', 'breed')

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'farm', 'field_number', 'status', 'planting_date')
    list_filter = ('status', 'farm')
    search_fields = ('name', 'field_number')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name', 'farm', 'type', 'status', 'assigned_to')
    list_filter = ('type', 'status', 'farm')
    search_fields = ('name', 'registration_number')

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'farm', 'category', 'quantity', 'unit')
    list_filter = ('category', 'farm')
    search_fields = ('name', 'category')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('date', 'farm', 'description', 'amount', 'type', 'status')
    list_filter = ('type', 'status', 'farm')
    search_fields = ('description', 'reference_number')

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('name', 'farm', 'category', 'status', 'contact_person')
    list_filter = ('category', 'status', 'farm')
    search_fields = ('name', 'contact_person', 'email')

@admin.register(FuelRecord)
class FuelRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'date', 'quantity', 'cost', 'filled_by')
    list_filter = ('vehicle__farm', 'date')
    search_fields = ('vehicle__name', 'notes')

@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'date', 'type', 'cost', 'next_maintenance_date')
    list_filter = ('vehicle__farm', 'type', 'date')
    search_fields = ('vehicle__name', 'description')