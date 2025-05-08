
import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Example interface for a property
interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
}

export const ApiExample = () => {
  const { isLoading, error, fetchData, createData } = useApi();
  const [properties, setProperties] = useState<Property[]>([]);

  // Example of using the API to fetch data
  const loadProperties = async () => {
    // Here's where you would change the URL when needed
    const response = await fetchData<Property[]>('/properties');
    
    if (response.success && response.data) {
      setProperties(response.data);
      toast.success('Properties loaded successfully');
    }
  };

  // Example of using the API to create data
  const addNewProperty = async () => {
    const newProperty = {
      name: 'New Beach House',
      location: 'Nha Trang, Vietnam',
      price: 1200000,
    };
    
    const response = await createData<Property>('/properties', newProperty);
    
    if (response.success && response.data) {
      setProperties(prev => [...prev, response.data as Property]);
      toast.success('Property added successfully');
    }
  };

  useEffect(() => {
    // Load data when component mounts
    // This is commented out since we don't have a real API to connect to
    // loadProperties();
  }, []);

  return (
    <div className="p-4 rounded-lg border bg-white">
      <h2 className="text-xl font-semibold mb-4">API Example</h2>
      
      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-500 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex gap-2 mb-4">
        <Button onClick={loadProperties} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Properties'}
        </Button>
        <Button onClick={addNewProperty} disabled={isLoading} variant="outline">
          Add Property
        </Button>
      </div>
      
      <div className="space-y-2">
        {properties.map(property => (
          <div key={property.id} className="p-3 border rounded-md">
            <div className="font-medium">{property.name}</div>
            <div className="text-muted-foreground text-sm">{property.location}</div>
            <div className="text-sm">{property.price.toLocaleString()} VND</div>
          </div>
        ))}
        
        {properties.length === 0 && !isLoading && (
          <div className="text-center p-4 text-muted-foreground">
            No properties to display
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiExample;
