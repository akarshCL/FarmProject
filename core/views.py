from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import (
    Farm, Employee, Livestock, Crop, Vehicle, 
    Inventory, Transaction, Vendor, FuelRecord, 
    MaintenanceRecord
)
from .serializers import (
    FarmSerializer, EmployeeSerializer, LivestockSerializer,
    CropSerializer, VehicleSerializer, InventorySerializer,
    TransactionSerializer, VendorSerializer, FuelRecordSerializer,
    MaintenanceRecordSerializer
)

class FarmViewSet(viewsets.ModelViewSet):
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Farm.objects.filter(owner=user)

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        farm = self.get_object()
        
        # Get farm statistics
        stats = {
            'total_employees': Employee.objects.filter(farm=farm).count(),
            'active_employees': Employee.objects.filter(farm=farm, status='active').count(),
            'total_livestock': Livestock.objects.filter(farm=farm).count(),
            'total_crops': Crop.objects.filter(farm=farm).count(),
            'total_vehicles': Vehicle.objects.filter(farm=farm).count(),
            'inventory_items': Inventory.objects.filter(farm=farm).count(),
            'total_vendors': Vendor.objects.filter(farm=farm).count(),
        }
        
        # Get financial summary
        financial = Transaction.objects.filter(farm=farm)
        stats['total_income'] = financial.filter(type='income').aggregate(
            total=Sum('amount'))['total'] or 0
        stats['total_expenses'] = financial.filter(type='expense').aggregate(
            total=Sum('amount'))['total'] or 0
        stats['net_profit'] = stats['total_income'] - stats['total_expenses']
        
        return Response(stats)

class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Employee.objects.filter(farm__owner=self.request.user)

class LivestockViewSet(viewsets.ModelViewSet):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Livestock.objects.filter(farm__owner=self.request.user)

class CropViewSet(viewsets.ModelViewSet):
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Crop.objects.filter(farm__owner=self.request.user)

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(farm__owner=self.request.user)

class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Inventory.objects.filter(farm__owner=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(farm__owner=self.request.user)

class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vendor.objects.filter(farm__owner=self.request.user)

class FuelRecordViewSet(viewsets.ModelViewSet):
    serializer_class = FuelRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FuelRecord.objects.filter(vehicle__farm__owner=self.request.user)

class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MaintenanceRecord.objects.filter(vehicle__farm__owner=self.request.user)