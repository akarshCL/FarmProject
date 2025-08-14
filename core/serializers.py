from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Farm, Employee, Livestock, Crop, Vehicle, 
    Inventory, Transaction, Vendor, FuelRecord, 
    MaintenanceRecord, Plot, PlotImage, PlotWorker,
    PlantingCycle
)

class PlotImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlotImage
        fields = '__all__'

class PlotWorkerSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    
    class Meta:
        model = PlotWorker
        fields = '__all__'

class PlantingCycleSerializer(serializers.ModelSerializer):
    profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = PlantingCycle
        fields = '__all__'

    def get_profit(self, obj):
        return obj.revenue - obj.expenses

class PlotSerializer(serializers.ModelSerializer):
    images = PlotImageSerializer(many=True, read_only=True)
    workers = PlotWorkerSerializer(many=True, read_only=True, source='plotworker_set')
    current_cycle = PlantingCycleSerializer(read_only=True)
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = Plot
        fields = '__all__'

    def get_current_cycle(self, obj):
        return obj.plantingcycle_set.filter(status='ongoing').first()

    def get_total_revenue(self, obj):
        return obj.plantingcycle_set.all().aggregate(
            total=models.Sum('revenue')
        )['total'] or 0

    def get_total_expenses(self, obj):
        return obj.plantingcycle_set.all().aggregate(
            total=models.Sum('expenses')
        )['total'] or 0

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class FarmSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    
    class Meta:
        model = Farm
        fields = ['id', 'name', 'owner', 'owner_details', 'address', 
                 'total_area', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class EmployeeSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Employee
        fields = ['id', 'farm', 'user', 'user_details', 'role', 'phone', 
                 'address', 'salary', 'join_date', 'status']

class LivestockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestock
        fields = '__all__'

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    assigned_to_details = EmployeeSerializer(source='assigned_to', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class FuelRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelRecord
        fields = '__all__'

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'