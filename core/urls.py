from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmViewSet, EmployeeViewSet, LivestockViewSet,
    CropViewSet, VehicleViewSet, InventoryViewSet,
    TransactionViewSet, VendorViewSet, FuelRecordViewSet,
    MaintenanceRecordViewSet
)

router = DefaultRouter()
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'livestock', LivestockViewSet, basename='livestock')
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'fuel-records', FuelRecordViewSet, basename='fuel-record')
router.register(r'maintenance-records', MaintenanceRecordViewSet, basename='maintenance-record')

urlpatterns = [
    path('', include(router.urls)),
]